import { Wallet, TxInfo, AddressInfo } from "./Wallet";
import { observable, computed } from "mobx";
import * as bitcoin from 'bitcoinjs-lib';
import { HDPrivateKey, Unit } from "bitcore-lib";
import Blockchair, { Chain } from './api/Blockchair';
import BTCOM from "./api/BTCOM";

export default class BTCWallet extends Wallet {

    private _network?: bitcoin.Network;

    constructor(opts: { root?: HDPrivateKey, mnemonic?: string, path?: string, network?: bitcoin.Network }) {
        super(opts);
        this._network = opts.network;
        this.balance = this.load('balance') || '0';
        this.txs = this.load('txs') || [];
    }

    protected getExternalPath(): string {
        return `m/44'/0'/0'/0`;
    }

    protected getChangePath(): string {
        return `m/44'/0'/0'/1`;
    }

    get symbol() { return 'btc'; }

    protected _mainAddress?: string[];
    get mainAddress() {
        if (this._mainAddress) return this._mainAddress;
        let key = this._root.derive(super.getExternalPathIndex(0));
        this._mainAddress = this.genAddress(key);
        return this._mainAddress as string[];
    }

    async refresh() {
        if (!this.shouldRefreshing()) return;
        console.warn(`${this.symbol} refreshing`);

        let balance = 0;
        let txs: TxInfo[] = [];

        let info = await this.scanAddresses(0, 1, false);

        balance = info.reduce((prev, curr) => prev + <number>curr.balance, 0);
        txs = txs.concat(info.map(i => i.txs).flatten(false).toArray());

        info = await this.scanAddresses(0, 1);

        balance += info.reduce((prev, curr) => prev + <number>curr.balance, 0);
        txs = txs.concat(info.map(i => i.txs).flatten(false).toArray());

        this.balance = Unit.fromSatoshis(balance).toBTC().toString();

        let oldestTx = this.txs.min(tx => tx.timestamp);
        let oldestTime = oldestTx ? oldestTx.timestamp : 0;
        let newTxs = txs.filter(t => t.timestamp > oldestTime);
        this.txs = newTxs.concat(this.txs).sort((a, b) => b.timestamp - a.timestamp).distinct((i1, i2) => i1.hash === i2.hash).toArray();

        this.save('balance', this.balance);
        this.save('txs', this.txs);
    }

    transfer(opts: { to: { address: string, amount: number }[]; message?: string | undefined; }) {

    }

    buildTx(args: { inputs: { txId: string, vout: number }[], outputs: { address: string, amount: number }[] }) {
        let key = this._root.derive(this.getExternalPathIndex(0));
        const keyPair = bitcoin.ECPair.fromPrivateKey(key['privateKey'].toBuffer());
        const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: this._network });

        const { inputs, outputs } = args;
        const builder = new bitcoin.TransactionBuilder(this._network);

        inputs.forEach(i => {
            builder.addInput(i.txId, i.vout, undefined, p2wpkh.output);
        });

        outputs.forEach(o => {
            builder.addOutput(o.address, o.amount);
        });
    }

    protected genAddress(key: HDPrivateKey) {
        let p2wpkh = bitcoin.payments.p2wpkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        let p2pkh = bitcoin.payments.p2pkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        // let p2sh = bitcoin.payments.p2sh({ redeem: bitcoin.payments.p2wpkh({ pubkey: key.hdPublicKey.publicKey.toBuffer() }), network: this._network });
        // console.log(p2sh);
        return [p2wpkh.address!, p2pkh.address!,];
    }

    async scanAddresses(from: number, to: number, external = true, chain: Chain = 'bitcoin') {
        let addrs = await this.genAddresses(from, to, external);
        let addresses = chain === 'bitcoin-cash' ? addrs.map(a => a[0]) : addrs.flatten(false).toArray();

        let addrsInfo: AddressInfo[] = [];
        let knownTxs: string[] = this.txs.map(t => t.hash);

        for (let addr of addresses) {
            let info = await Blockchair.fetchAddress(addr, chain);
            if (!info) continue;

            let balance = info.address.balance;
            if (info.address.transaction_count === 0) {
                addrsInfo.push({ address: addr, balance, txs: <TxInfo[]>[] });
                continue;
            }

            // let txs = await this.scanAddressTx(addr, all);
            let unknownTxs = info.transactions.except(knownTxs).take(10).toArray();
            knownTxs = knownTxs.concat(unknownTxs);

            let txs = await this.getTxs(unknownTxs, addresses);

            let addrInfo = { address: addr, balance, txs: txs };
            addrsInfo.push(addrInfo);
        }

        return addrsInfo;
    }

    async getTxs(hashes: string[], knownAddress: string[], symbol = 'btc') {
        let result = await BTCOM.fetchTxs(hashes, symbol as any);
        if (!result) return [];
        let btcTxs = Array.isArray(result) ? result : [result];

        let txs = btcTxs.filter(i => i).map(tx => {
            let inputsValue = tx.inputs.filter(t => t.prev_addresses.some(a => knownAddress.includes(a))).reduce((prev, curr) => (prev + curr.prev_value), 0);
            let outputsValue = tx.outputs.filter(t => t.addresses.some(a => knownAddress.includes(a))).reduce((prev, curr) => prev + curr.value, 0);
            let isIncome = outputsValue > inputsValue;
            let amount = outputsValue - inputsValue;

            return <TxInfo>{
                blockHash: tx.block_hash,
                blockHeight: tx.block_height,
                hash: tx.hash,
                timestamp: tx.created_at,
                inputs: tx.inputs.map(i => { return { address: i.prev_addresses, value: i.prev_value } }),
                outputs: tx.outputs.map(o => { return { address: o.addresses, value: o.value } }),
                isIncome,
                amount
            };
        });

        return txs;
    }

    async scanAddressTx(address: string, knownAddress: string[]) {
        let btcTx = await BTCOM.fetchAddressTx(address, 'btc');

        let txs: TxInfo[] = (btcTx ? btcTx.list : []).map(tx => {
            let fromMe = tx.inputs.filter(t => t.prev_addresses.some(a => knownAddress.includes(a)));
            let toMe = tx.outputs.filter(t => t.addresses.includes(address)).length > 0;

            return <TxInfo>{
                blockHash: tx.block_hash,
                blockHeight: tx.block_height,
                hash: tx.hash,
                timestamp: tx.created_at,
                inputs: tx.inputs.map(i => { return { address: i.prev_addresses, value: i.prev_value } }),
                outputs: tx.outputs.map(o => { return { address: o.addresses, value: o.value } }),
                isIncome: fromMe ? false : toMe,
            };
        });

        return txs;
    }

    // genAddresses(from: number, to: number, external = true): Promise<string[][]> {
    //     return new Promise(resolve => {
    //         resolve([['1BNFNrZSg8JjkyQJZDD3pRD8c72KnRaKy6', '1AnuEWsiBEdUR1qfgXQ7qB9kQetmKZRiKJ']])
    //     });
    // }
}
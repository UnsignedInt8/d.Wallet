import { Wallet, TxInfo, AddressInfo, IUtxo } from "./Wallet";
import { observable, computed } from "mobx";
import * as bitcoin from 'bitcoinjs-lib';
import { HDPrivateKey, Unit, PrivateKey, Transaction } from "bitcore-lib";
import Blockchair, { Chain } from './api/Blockchair';
import BTCOM from "./api/BTCOM";

export default class BTCWallet extends Wallet {

    private _network?: bitcoin.Network;

    constructor(opts: { root?: HDPrivateKey, mnemonic?: string, path?: string, network?: bitcoin.Network }) {
        super(opts);
        this._network = opts.network;
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

        console.log(this.balance, this.txs);
        this.save('balance', this.balance);
        this.save('txs', this.txs);
    }

    transfer(opts: { to: { address: string, amount: number }[]; message?: string | undefined; }) {

    }

    buildTx(args: { inputs: IUtxo[], outputs: { address: string, amount: number }[], satoshiPerByte: number, changeIndex?: number }) {

        const keys = this.getKeys(0, 5).concat(this.getKeys(0, 3, false));
        const addresses = keys.map(key => {
            let [segwit, legacy] = this.genAddress(key);
            let pubkeyBuf = key.hdPublicKey.publicKey.toBuffer();
            let keyPair = bitcoin.ECPair.fromPrivateKey(key['privateKey'].toBuffer(), { network: this._network });

            const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: pubkeyBuf, network: this._network });
            const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: this._network })
            return { segwit, legacy, pubkey: pubkeyBuf.toString('hex'), key, keyPair, p2wpkh, };
        });

        const { inputs, outputs } = args;
        const builder = new bitcoin.TransactionBuilder(this._network);

        inputs.forEach((v, i) => {
            let [target] = addresses.filter(a => v.pubkey === a.pubkey || v.pubkey === a.legacy || v.pubkey === a.segwit);
            if (!target) return;
            let { p2wpkh } = target;

            builder.addInput(v.txid, v.vout, undefined, p2wpkh.output);
        });

        outputs.forEach(o => {
            builder.addOutput(o.address, o.amount);
        });

        let txSize = builder.buildIncomplete().byteLength() + 20;

        let totalFee = txSize * (args.satoshiPerByte + 1);
        let totalIn = inputs.sum(i => i.amount);
        let totalOut = outputs.sum(o => o.amount);
        let changeAmount = totalIn - totalOut - totalFee;

        let [changeAddr] = this.changes[args.changeIndex === undefined ? Date.now() % this.changes.length : args.changeIndex!];
        builder.addOutput(changeAddr, changeAmount);

        inputs.forEach((v, i) => {
            let target = addresses.filter(a => v.pubkey === a.pubkey || v.pubkey === a.legacy || v.pubkey === a.segwit)[0];
            if (!target) return;
            let { keyPair, } = target;

            builder.sign(i, keyPair, undefined, undefined, v.amount);
        });

        return { tx: builder.build(), change: { address: changeAddr, amount: changeAmount }, fee: totalFee };
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
            let amount = Unit.fromSatoshis(outputsValue - inputsValue);

            return <TxInfo>{
                blockHash: tx.block_hash,
                blockHeight: tx.block_height,
                hash: tx.hash,
                timestamp: tx.created_at,
                inputs: tx.inputs.map(i => { return { address: i.prev_addresses, value: i.prev_value } }),
                outputs: tx.outputs.map(o => { return { address: o.addresses, value: o.value } }),
                isIncome,
                amount: `${amount.toBTC()}`
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
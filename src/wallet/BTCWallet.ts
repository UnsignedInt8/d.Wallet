import { Wallet, TxInfo, AddressInfo } from "./Wallet";
import { observable, computed } from "mobx";
import * as bitcoin from 'bitcoinjs-lib';
import { HDPrivateKey, Unit } from "bitcore-lib";
import { from as linq } from 'fromfrom';
import Blockchair from './api/Blockchair';
import BTCOM from "./api/BTCOM";

export default class BTCWallet extends Wallet {

    static readonly symbol: 'btc';

    private _network?: bitcoin.Network;

    constructor(opts: { root?: HDPrivateKey, mnemonic?: string, path?: string, network?: bitcoin.Network }) {
        super(opts);
        this._network = opts.network;
        this.balance = this.load('balance') || '0';
    }

    protected getExternalPath(): string {
        return `m/44'/0'/0'/0`;
    }

    protected getChangePath(): string {
        return `m/44'/0'/0'/1`;
    }

    protected _mainAddress?: string[];
    get mainAddress() {
        if (this._mainAddress) return this._mainAddress;
        let key = this._root.derive(super.getExternalPathIndex(0));
        this._mainAddress = this.genAddress(key);
        return this._mainAddress as string[];
    }

    async refresh() {
        let balance = 0;
        let txs: TxInfo[] = [];

        let info = await this.scanAddresses(0, 5, false);

        balance = info.reduce((prev, curr) => prev + <number>curr.balance, 0);
        txs = txs.concat(linq(info.map(i => i.txs)).flatMap(i => i).toArray());

        for (let i = 0; true; i += 5) {
            info = await this.scanAddresses(i, i + 5);

            balance += info.reduce((prev, curr) => prev + <number>curr.balance, 0);
            txs = txs.concat(linq(info.map(i => i.txs)).flatMap(i => i).toArray());

            if (linq(info).every(i => i.txs.length === 0)) break;
        }

        this.balance = Unit.fromSatoshis(balance).toBTC().toString();
        this._txs = txs;

        this.save('balance', this.balance);
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

    genAddresses(from: number, to: number, external = true): Promise<string[][]> {
        return new Promise(resolve => {
            resolve([['1Nh7uHdvY6fNwtQtM1G5EZAFPLC33B59rB', '1MKaDLRnzR2M4Y38rQSix5FycVEWW25CBR'], ['bc1qjl8uwezzlech723lpnyuza0h2cdkvxvh54v3dn', '1AnuEWsiBEdUR1qfgXQ7qB9kQetmKZRiKJ']])
        });
    }

    async scanAddresses(from: number, to: number, external = true) {
        let addresses = await this.genAddresses(from, to, external);

        let segwitAddress = addresses.map(a => a[0]);
        let legacyAddress = addresses.map(a => a[1]);
        let all = segwitAddress.concat(legacyAddress);

        let addrsInfo = (await Promise.all(all.map(async addr => {
            let info = await Blockchair.fetchAddress(addr, 'bitcoin');
            console.log(info)
            if (!info) return null;

            let balance = info.address.balance;
            if (info.address.transaction_count === 0) {
                return { address: addr, balance, txs: [] };
            }

            let txs = await this.scanAddressTx(addr, all);

            console.log(txs);
            return { address: addr, balance, txs };
        }))).filter(i => i) as AddressInfo[];

        return addrsInfo;
    }

    async scanAddressTx(address: string, knownAddress: string[]) {
        let btcTx = await BTCOM.fetchAddressTx(address, 'btc');

        let txs: TxInfo[] = (btcTx ? btcTx.list : []).map(tx => {
            let fromMe = tx.inputs.filter(t => linq(t.prev_addresses).some(a => knownAddress.includes(a)));
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
}
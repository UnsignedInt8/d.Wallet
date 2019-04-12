import { Wallet } from "./Wallet";
import { observable, computed } from "mobx";
import * as bitcoin from 'bitcoinjs-lib';
import { HDPrivateKey } from "bitcore-lib";

export default class BTCWallet extends Wallet {

    static readonly symbol: 'btc';

    private _network?: bitcoin.Network;

    constructor(opts: { mnemonic: string, path?: string, segwit?: boolean, network?: bitcoin.Network }) {
        super(opts);
        this._segwit = opts.segwit === undefined ? true : opts.segwit;
        this._network = opts.network;
    }

    protected getExternalPath(): string {
        return `m/44'/0'/0'/0`;
    }

    protected getChangePath(): string {
        return `m/44'/0'/0'/1`;
    }

    private _mainAddress?: string[];
    get mainAddress() {
        if (this._mainAddress) return this._mainAddress;
        let key = this._root.derive(super.getExternalPathIndex(0));

        let p2wpkh = bitcoin.payments.p2wpkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        let p2pkh = bitcoin.payments.p2pkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        let p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh });
        this._mainAddress = [p2wpkh.address!, p2pkh.address!, p2sh.address!];

        return this._mainAddress as string[];
    }

    private _segwit = true;

    get segwit() { return this._segwit; }
    set segwit(value: boolean) {
        if (this._segwit === value) return;
        this._segwit = value;
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


    protected discoverAddresses() {

    }
}
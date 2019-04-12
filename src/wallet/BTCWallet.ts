import { Wallet } from "./Wallet";
import { observable, computed } from "mobx";
import * as bitcoin from 'bitcoinjs-lib';

export default class BTCWallet extends Wallet {

    private _network?: bitcoin.Network;

    constructor(opts: { mnemonic: string, path?: string, segwit?: boolean, network?: bitcoin.Network }) {
        super(opts);
        this._segwit = opts.segwit === undefined ? true : opts.segwit;
        this._network = opts.network;
    }

    protected getDefaultPath(): string {
        return `m/44'/0'/0'/0`;
    }

    private _address?: string[];
    get mainAddress() {
        if (this._address) return this._address;
        let key = this._root.derive(super.getPathIndex(0));

        let pkh = this.segwit ? bitcoin.payments.p2wpkh : bitcoin.payments.p2pkh;

        let p2wpkh = bitcoin.payments.p2wpkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        let p2pkh = bitcoin.payments.p2pkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        let p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh });
        this._address = [p2wpkh.address!, p2pkh.address!, p2sh.address!];

        return this._address as string[];
    }

    private _segwit = true;

    get segwit() { return this._segwit; }
    set segwit(value: boolean) {
        if (this._segwit === value) return;
        this._address = undefined;
        this._segwit = value;
    }

    transfer(opts: { to: { address: string, amount: number }[]; message?: string | undefined; }) {

    }

    private getKeys() {

    }

    buildTx(args: { inputs: { txId: string, vout: number }[], outputs: { address: string, amount: number }[] }) {
        let key = this._root.derive(this.getPathIndex(0));
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
}
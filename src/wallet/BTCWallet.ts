import { Wallet } from "./Wallet";
import { observable, computed } from "mobx";
import * as bitcoin from 'bitcoinjs-lib';
import { testnet, regtest } from "bitcoinjs-lib/types/networks";

export default class BTCWallet extends Wallet {

    static readonly defaultPath = `m/44'/0'/0'/0`;

    private _network?: bitcoin.Network;

    constructor(opts: { mnemonic: string, path: string, segwit?: boolean, network?: bitcoin.Network }) {
        super(opts);
        this._segwit = opts.segwit === undefined ? true : opts.segwit;
    }

    @observable private _address?: string;
    get address() {
        if (this._address) return this._address;
        let key = this._root.derive(super.getPathIndex(0));

        let pkh = this.segwit ? bitcoin.payments.p2wpkh : bitcoin.payments.p2pkh;
        let { address } = pkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        this._address = address;

        return this._address as string;
    }

    @observable private _segwit = true;

    @computed
    get segwit() { return this._segwit; }
    set segwit(value: boolean) {
        if (this._segwit === value) return;
        this._address = undefined;
        this._segwit = value;
    }

    transfer(opts: { to: string | string[]; amount: number; message?: string | undefined; }) {
        let to = typeof opts.to === 'string' ? [opts.to] : opts.to;
        let key = this._root.derive(this.getPathIndex(0));
        let user = bitcoin.ECPair.fromPrivateKey(key['privateKey'].toBuffer());

        const builder = new bitcoin.TransactionBuilder(this._network);

    }
}
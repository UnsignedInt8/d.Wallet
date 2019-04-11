import { Wallet } from "./Wallet";
import { PrivateKey } from 'bitcore-lib-cash';

export default class BCHWallet extends Wallet {

    constructor(opts: { mnemonic: string, path?: string, }) {
        super(opts);
    }

    protected getDefaultPath(): string {
        return `m/44'/145'/0'/0`;
    }

    private _address?: string;
    get address() {
        if (this._address) return this._address;
        let key = this._root.derive(this.getPathIndex(0))['privateKey'].toString();
        console.log(key);
        this._address = new PrivateKey(key).toAddress().toString().split(':')[1];
        return this._address as string;
    }

    transfer(opts: { to: string | string[]; amount: number; message?: string | undefined; }) {
        throw new Error("Method not implemented.");
    }

}
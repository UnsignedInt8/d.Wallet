import { Wallet } from "./Wallet";
import Tx from 'ethereumjs-tx';

export default class ETHWallet extends Wallet {

    static readonly defaultPath = `m/44'/60'/0'/0/0`;

    constructor(opts: { mnemonic: string, path: string, }) {
        super(opts);
    }

    private _address?: string;
    get address() {
        if (this._address) return this._address;
        let key = this._root.derive(this.getPathIndex(0));
        return '';
    }

    transfer(opts: { to: string | string[]; amount: number; message?: string | undefined; }) {
        throw new Error("Method not implemented.");
    }
}
import { Wallet } from "./Wallet";
import { PrivateKey } from 'litecore-lib';

export default class LTCWallet extends Wallet {

    private _address?: string;
    get address() {
        let hdKey = this._root.derive(this.getPathIndex(0));
        let key = hdKey['privateKey'].toString();
        this._address = new PrivateKey(key).toAddress().toString();
        return this._address as string;
    }

    transfer(opts: { to: string | string[]; amount: number; message?: string | undefined; }) {
        throw new Error("Method not implemented.");
    }

    protected getDefaultPath(): string {
        return `m/44'/2'/0'/0`;
    }

}
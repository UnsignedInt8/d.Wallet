import { Wallet } from "./Wallet";
import { PrivateKey } from 'litecore-lib';

export default class LTCWallet extends Wallet {
    transfer(opts: { to: { address: string; amount: string | number; }[]; message?: string | undefined; }) {
        throw new Error("Method not implemented.");
    }

    private _address?: string[];
    get mainAddress() {
        let hdKey = this._root.derive(this.getPathIndex(0));
        let key = hdKey['privateKey'].toString();
        this._address = [new PrivateKey(key).toAddress().toString()];
        return this._address as string[];
    }

    protected getDefaultPath(): string {
        return `m/44'/2'/0'/0`;
    }

}
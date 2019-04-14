import { Wallet } from "./Wallet";
import { PrivateKey } from 'litecore-lib';
import { observable, computed } from "mobx";

export default class LTCWallet extends Wallet {

    transfer(opts: { to: { address: string; amount: string | number; }[]; message?: string | undefined; }) {
        throw new Error("Method not implemented.");
    }

    private _mainAddress?: string[];
    get mainAddress() {
        let hdKey = this._root.derive(this.getExternalPathIndex(0));
        this._mainAddress = this.genAddress(hdKey);
        return this._mainAddress as string[];
    }

    protected getExternalPath(): string {
        return `m/44'/2'/0'/0`;
    }

    protected getChangePath(): string {
        return `m/44'/2'/0'/1`;
    }

    protected async scanAddresses(from: number, to: number, external = true) {
        return [];
    }

    protected genAddress(key: import("bitcore-lib").HDPrivateKey): string[] {
        let privkey = key['privateKey'].toString();
        return [new PrivateKey(privkey).toAddress().toString()];
    }

    refresh() { }
}
import { Wallet } from "./Wallet";
import { PrivateKey } from 'bitcore-lib-cash';
import { HDPrivateKey } from "bitcore-lib";
import { observable, computed } from "mobx";

export default class BCHWallet extends Wallet {
    transfer(opts: { to: { address: string; amount: string | number; }[]; message?: string | undefined; }) {
        throw new Error("Method not implemented.");
    }

    protected getExternalPath(): string {
        return `m/44'/145'/0'/0`;
    }

    protected getChangePath(): string {
        return `m/44'/145'/0'/1`;
    }

    private _mainAddress?: string[];
    get mainAddress() {
        if (this._mainAddress) return this._mainAddress;
        let key = this._root.derive(this.getExternalPathIndex(0));
        this._mainAddress = this.genAddress(key);
        return this._mainAddress!;
    }

    protected genAddress(key: HDPrivateKey) {
        let privkey = key['privateKey'].toString();
        return [new PrivateKey(privkey).toAddress().toString().split(':')[1]] as string[];
    }

    protected async scanAddresses(from: number, to: number, external = true) {
        return [];
    }

    refresh() { }
}
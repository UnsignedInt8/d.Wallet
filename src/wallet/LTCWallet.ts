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
        let key = hdKey['privateKey'].toString();
        this._mainAddress = [new PrivateKey(key).toAddress().toString()];
        return this._mainAddress as string[];
    }

    @observable _addresses?: string[][];
    @computed get addresses() {
        if (this._addresses) return this._addresses;
        return [];
    }

    protected getExternalPath(): string {
        return `m/44'/2'/0'/0`;
    }

    protected getChangePath(): string {
        return `m/44'/2'/0'/1`;
    }

    protected discoverAddresses() {

    }
}
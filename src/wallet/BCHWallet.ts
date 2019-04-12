import { Wallet } from "./Wallet";
import { PrivateKey } from 'bitcore-lib-cash';

export default class BCHWallet extends Wallet {
    transfer(opts: { to: { address: string; amount: string | number; }[]; message?: string | undefined; }) {
        throw new Error("Method not implemented.");
    }

    constructor(opts: { mnemonic: string, path?: string, }) {
        super(opts);
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
        let key = this._root.derive(this.getExternalPathIndex(0))['privateKey'].toString();
        this._mainAddress = [new PrivateKey(key).toAddress().toString().split(':')[1]];
        return this._mainAddress as string[];
    }

    protected discoverAddresses() {

    }

}
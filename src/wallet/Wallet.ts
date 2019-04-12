import * as bip39 from 'bip39';
import * as Mnemonic from 'bitcore-mnemonic';
import { HDPrivateKey } from 'bitcore-lib';

export abstract class Wallet {

    protected _root: HDPrivateKey
    protected _path: string;

    constructor(opts: { mnemonic: string, path?: string }) {
        const { mnemonic } = opts;
        let seed = new Mnemonic(mnemonic);
        this._root = seed.toHDPrivateKey();
        this._path = opts.path || this.getDefaultPath();
    }

    abstract mainAddress: string[];
    abstract transfer(opts: { to: { address: string, amount: number | string }[], message?: string });
    protected abstract getDefaultPath(): string;

    getPathIndex(index: number) {
        return `${this._path}/${index}`;
    }
}


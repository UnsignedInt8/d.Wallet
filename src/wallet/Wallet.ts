import * as bip39 from 'bip39';
import * as Mnemonic from 'bitcore-mnemonic';
import { HDPrivateKey } from 'bitcore-lib';

export abstract class Wallet {

    protected _root: HDPrivateKey
    protected _path: string;

    constructor(opts: { mnemonic: string, path: string }) {
        const { mnemonic } = opts;
        let seed = new Mnemonic(mnemonic);
        this._root = seed.toHDPrivateKey();
        this._path = opts.path;
    }

    abstract address: string;
    abstract transfer(opts: { to: string | string[], amount: number, message?: string });

    getPathIndex(index: number) {
        return `${this._path}/${index}`;
    }
}


import * as bip39 from 'bip39';
import * as Mnemonic from 'bitcore-mnemonic';
import { HDPrivateKey } from 'bitcore-lib';
import store from 'store';
import sleep from 'sleep-promise';

export abstract class Wallet {

    protected _root: HDPrivateKey
    protected _path: string;

    constructor(opts: { mnemonic: string, path?: string }) {
        const { mnemonic } = opts;
        let seed = new Mnemonic(mnemonic);
        this._root = seed.toHDPrivateKey();
        this._path = opts.path || this.getExternalPath();
    }

    abstract mainAddress: string[];
    abstract transfer(opts: { to: { address: string, amount: number | string }[], message?: string });
    protected abstract getExternalPath(): string;
    protected abstract getChangePath(): string;
    protected abstract discoverAddresses();

    getExternalPathIndex(index: number) {
        return `${this._path}/${index}`;
    }

    getExternalKeys(from: number, to: number) {
        return new Promise<HDPrivateKey[]>(async resolve => {
            let keys: HDPrivateKey[] = [];

            for (let i = from; i < to; i++) {
                let key = this._root.derive(this.getExternalPathIndex(i));
                keys.push(key);
                await sleep(50);
            }

            resolve(keys);
        });
    }
}


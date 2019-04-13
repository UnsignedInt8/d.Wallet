import * as bip39 from 'bip39';
import * as Mnemonic from 'bitcore-mnemonic';
import { HDPrivateKey } from 'bitcore-lib';
import store from 'store';
import sleep from 'sleep-promise';
import { observable } from 'mobx';

export abstract class Wallet {

    protected _root: HDPrivateKey
    protected _path: string;

    constructor(opts: { root?: HDPrivateKey, mnemonic?: string, path?: string }) {
        const { mnemonic, root } = opts;
        this._root = root || new Mnemonic(mnemonic).toHDPrivateKey();
        this._path = opts.path || this.getExternalPath();
    }

    abstract mainAddress: string[];
    @observable balance: string = '';
    @observable txs: [] = [];
    abstract transfer(opts: { to: { address: string, amount: number | string }[], message?: string });
    protected abstract getExternalPath(): string;
    protected abstract getChangePath(): string;
    protected abstract discoverAddresses();

    protected getExternalPathIndex(index: number) {
        return `${this._path}/${index}`;
    }

    protected getChangePathIndex(index: number) {
        return `${this.getChangePath()}/${index}`;
    }

    protected getKeys(from: number, to: number, external = true) {
        return new Promise<HDPrivateKey[]>(async resolve => {
            let keys: HDPrivateKey[] = [];

            for (let i = from; i < to; i++) {
                let key = this._root.derive(external ? this.getExternalPathIndex(i) : this.getChangePathIndex(i));
                keys.push(key);
                await sleep(50);
            }

            resolve(keys);
        });
    }
}


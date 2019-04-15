import * as bip39 from 'bip39';
import * as Mnemonic from 'bitcore-mnemonic';
import { HDPrivateKey } from 'bitcore-lib';
import * as store from 'store';
import sleep from 'sleep-promise';
import { observable, computed, } from 'mobx';

export abstract class Wallet {

    protected _root: HDPrivateKey
    protected _path: string;
    protected _lastRefreshedTime = 0;

    constructor(opts: { root?: HDPrivateKey, mnemonic?: string, path?: string }) {
        const { mnemonic, root } = opts;
        this._root = root || new Mnemonic(mnemonic).toHDPrivateKey();
        this._path = opts.path || this.getExternalPath();
    }

    abstract get symbol();
    abstract mainAddress: string[];
    @observable balance: string = '0';
    @observable txs: TxInfo[] = [];
    abstract transfer(opts: { to: { address: string, amount: number | string }[], message?: string });
    abstract async refresh();
    protected abstract getExternalPath(): string;
    protected abstract getChangePath(): string;
    protected abstract scanAddresses(from: number, to: number, external?: boolean): Promise<AddressInfo[]>;
    protected abstract genAddress(key: HDPrivateKey): string[];

    @observable protected _addresses?: string[][];
    @computed get addresses() {
        if (this._addresses) return this._addresses;
        this.genAddresses(0, 5).then(value => this._addresses = value);
        return this._addresses || [];
    }

    @observable protected _changes?: string[][];
    @computed get changes() {
        if (this._changes) return this._changes;
        this.genAddresses(0, 5, false).then(value => this._changes = value);
        return this._changes || [];
    }

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

    protected shouldRefreshing() {
        return false;
        if (Date.now() - this._lastRefreshedTime < 90 * 1000) return false;
        this._lastRefreshedTime = Date.now();
        return true;
    }

    protected save(key: string, value: any) {
        store.set(`${this['symbol']}:${key}`, value);
    }

    protected load(key: string) {
        return store.get(`${this['symbol']}:${key}`);
    }

    async genAddresses(from: number, to: number, external = true) {
        let addresses = (await this.getKeys(from, to, external)).map(key => this.genAddress(key));
        return addresses;
    }
}

export interface AddressInfo {
    address: string;
    balance: number | string;
    txs: TxInfo[];
}

export interface TxInfo {
    inputs: { address: string[], value: string | number }[];
    outputs: { address: string[], value: string | number }[];
    isIncome: boolean;
    timestamp: number;
    hash: string;
    blockHash: string;
    blockHeight: number;
    amount: number | string;
}
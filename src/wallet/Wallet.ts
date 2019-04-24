import * as bip39 from 'bip39';
import * as Mnemonic from 'bitcore-mnemonic';
import { HDPrivateKey, Transaction } from 'bitcore-lib';
import * as store from 'store';
import sleep from 'sleep-promise';
import { observable, computed, } from 'mobx';
import Blockchair, { Chain } from './api/Blockchair';
import { BTCUtxo } from '../types/BlockChair_Api';
import * as bitcoin from 'bitcoinjs-lib';
import * as bchaddrjs from 'bchaddrjs';

export abstract class Wallet {

    protected _root: HDPrivateKey
    protected _path: string;
    protected _lastRefreshedTime = 0;
    private _keys = { external: [], change: [] };

    constructor(opts: { root?: HDPrivateKey, mnemonic?: string, path?: string }) {
        const { mnemonic, root } = opts;
        this._root = root || new Mnemonic(mnemonic).toHDPrivateKey();
        this._path = opts.path || this.getExternalPath();

        this.balance = this.load('balance') || '0';
        this.txs = this.load('txs') || [];
    }

    abstract get symbol(): string;
    abstract get chain(): Chain;
    abstract mainAddress: string[];
    @observable balance = 0;
    @observable txs: TxInfo[] = [];
    abstract genTx(opts: { to: { address: string, amount: number | string }[], message?: string }): Promise<GenTxInfo | undefined>;
    abstract async refresh();
    protected abstract getExternalPath(): string;
    protected abstract getChangePath(): string;
    protected abstract scanAddresses(from: number, to: number, external?: boolean): Promise<AddressInfo[]>;
    protected abstract genAddress(key: HDPrivateKey): string[];
    abstract buildTx(args: { inputs: IUtxo[], outputs: { address: string, amount: number }[], satoshiPerByte: number, changeIndex?: number }): IBuildingTx;
    abstract broadcastTx(hex: string, chain: Chain);
    
    @observable protected _addresses?: string[][];
    @computed get addresses() {
        if (this._addresses) return this._addresses;
        this._addresses = this.genAddresses(0, 5)
        return this._addresses;
    }

    @observable protected _changes?: string[][];
    @computed get changes() {
        if (this._changes) return this._changes;
        this._changes = this.genAddresses(0, 3, false);
        return this._changes;
    }

    protected getExternalPathIndex(index: number) {
        return `${this._path}/${index}`;
    }

    protected getChangePathIndex(index: number) {
        return `${this.getChangePath()}/${index}`;
    }

    protected getKeys(from: number, to: number, external = true) {
        let keys: HDPrivateKey[] = [];
        let cache: HDPrivateKey[] = external ? this._keys.external : this._keys.change;

        for (let i = from; i < to; i++) {
            if (cache[i]) {
                keys.push(cache[i]);
                continue;
            };

            let key = this._root.derive(external ? this.getExternalPathIndex(i) : this.getChangePathIndex(i));
            keys.push(key);
            cache[i] = key;
        }

        return keys;
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

    genAddresses(from: number, to: number, external = true) {
        let addresses = this.getKeys(from, to, external).map(key => this.genAddress(key));
        return addresses;
    }

    protected async fetchUtxos(amount: number, chain: Chain) {
        let addresses = [this.addresses[0], ...this.changes, ...this.addresses.slice(1)].flatten(false).toArray();

        if (chain === 'bitcoin-cash') {
            addresses = addresses.filter(a => !bchaddrjs.isLegacyAddress(a));
        }

        let utxos: BTCUtxo[] = [];

        for (let addr of addresses) {
            let txs = await Blockchair.fetchUtxos(addr, chain) || [];
            utxos = utxos.concat(txs);
            if (utxos.sum(t => t.value) > amount) break;
        }

        return utxos.map(t => {
            return <IUtxo>{
                satoshis: t.value,
                address: t.recipient,
                script: t.script_hex,
                txid: t.transaction_hash,
                type: t.type,
                vout: t.index,
            }
        });
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
    fee: number | string;
    success?: boolean;
}


export interface IUtxo {
    txid: string;
    vout: number;
    satoshis: number;
    address: string;
    type: string | 'p2ms' | 'p2pk' | 'p2pkh' | 'p2wpkh' | 'p2sh' | 'p2wsh';
    script?: string;
}

export interface IBuildingTx {
    tx: bitcoin.Transaction | Transaction,
    change: { address: string, amount: number },
    fee: number,
};

export interface GenTxInfo {
    hex: string,
    id: string,
    msg?: string,
    change: { address: string, amount: number },
    fee: number,
    from: string[],
    to: { address: string, amount: number }[],
}
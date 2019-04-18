import { Wallet, AddressInfo, TxInfo, IUtxo } from "./Wallet";
import { PrivateKey, Transaction } from 'bitcore-lib-cash';
import { HDPrivateKey } from "bitcore-lib";
import { observable, computed } from "mobx";
import BTCWallet from "./BTCWallet";
import Blockchair, { Chain } from "./api/Blockchair";
import * as bchaddrjs from 'bchaddrjs';

export default class BCHWallet extends BTCWallet {

    protected getExternalPath(): string {
        return `m/44'/145'/0'/0`;
    }

    protected getChangePath(): string {
        return `m/44'/145'/0'/1`;
    }

    get symbol() { return 'bch'; }
    get chain(): Chain { return 'bitcoin-cash'; };

    protected _mainAddress?: string[];
    get mainAddress() {
        if (this._mainAddress) return this._mainAddress;
        let key = this._root.derive(this.getExternalPathIndex(0));
        this._mainAddress = this.genAddress(key);
        return this._mainAddress!;
    }

    protected genAddress(key: HDPrivateKey) {
        let privkey = key['privateKey'].toString();
        let cashAddr = new PrivateKey(privkey).toAddress().toString().split(':')[1];
        let legacy = bchaddrjs.toLegacyAddress(cashAddr);
        return [cashAddr, legacy];
    }

    async scanAddresses(from: number, to: number, external = true, chain: Chain = 'bitcoin-cash') {
        return await super.scanAddresses(from, to, external, chain);
    }

    async getTxs(hashes: string[], knownAddresses: string[], symbol = 'bch') {
        return await super.getTxs(hashes, knownAddresses.map(a => bchaddrjs.toLegacyAddress(a)).concat(knownAddresses), 'bch');
    }

    async genTx(opts: { to: { address: string, amount: number }[]; message?: string | undefined; satoshiPerByte: number }) {
        return { hex: '', id: '', change: { address: '', amount: 0 }, fee: 0 }
    }

    buildTx(args: { inputs: IUtxo[], outputs: { address: string, amount: number }[], satoshiPerByte: number, changeIndex?: number }) {
        return { tx: <any>{}, change: { address: '', amount: 0 }, fee: 0 }
    }

    // async genAddresses(from: number, to: number, external = true) {
    //     return new Promise<string[][]>(resolve => {
    //         if (external) resolve([['qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq', 'pqpv7s5e2w6y6470qfzuaffcay0v8l8nhy0x74rsjm'],]);
    //         else resolve([['qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq', 'qzl8jth497mtckku404cadsylwanm3rfxsx0g38nwl']]);
    //     });
    // }
}
import { Wallet, AddressInfo, TxInfo, IUtxo } from "./Wallet";
import { PrivateKey as BCHPrivateKey, Transaction as BCHTransaction } from 'bitcore-lib-cash';
import { HDPrivateKey, Networks, Transaction } from "bitcore-lib";
import { observable, computed } from "mobx";
import BTCWallet from "./BTCWallet";
import Blockchair, { Chain } from "./api/Blockchair";
import * as bchaddrjs from 'bchaddrjs';

export default class BCHWallet extends BTCWallet {

    constructor(opts: { root?: HDPrivateKey, mnemonic?: string, path?: string, network?: Networks.Network }) {
        super(opts);
    }

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
        let cashAddr = new BCHPrivateKey(privkey).toAddress(this._network).toString().split(':')[1];
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
        let totalAmount = opts.to.sum(t => t.amount);
        let utxos = await this.fetchUtxos(totalAmount, this.chain);
        if (utxos.length === 0) return;

        let { tx, change, fee } = this.buildTx({ inputs: utxos, outputs: opts.to, satoshiPerByte: opts.satoshiPerByte });
        let hex = tx.serialize() as string;
        let id = tx.id as string;

        return { hex, id, change, fee };
    }

    buildTx(args: { inputs: IUtxo[], outputs: { address: string, amount: number }[], satoshiPerByte: number, changeIndex?: number }) {
        let keys = this.getKeys(0, 5).concat(this.getKeys(0, 3, false)).map(key => key['privateKey'].toString()).map(privkey => new BCHPrivateKey(privkey));
        let [changeAddr] = this.changes[args.changeIndex === undefined ? Date.now() % this.changes.length : args.changeIndex];

        let utxos = args.inputs.map(i => new BCHTransaction.UnspentOutput(i));
        let tx = new BCHTransaction().from(utxos).change(changeAddr).feePerKb((args.satoshiPerByte + 1) * 1000);

        args.outputs.forEach(o => {
            tx.to(o.address, o.amount);
        });

        tx.sign(keys as any);
        return { tx, change: { address: changeAddr, amount: tx.getFee() }, fee: tx.getFee() };
    }

    // async genAddresses(from: number, to: number, external = true) {
    //     return new Promise<string[][]>(resolve => {
    //         if (external) resolve([['qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq', 'pqpv7s5e2w6y6470qfzuaffcay0v8l8nhy0x74rsjm'],]);
    //         else resolve([['qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq', 'qzl8jth497mtckku404cadsylwanm3rfxsx0g38nwl']]);
    //     });
    // }
}
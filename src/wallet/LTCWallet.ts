import { Wallet, TxInfo, IUtxo } from "./Wallet";
import { PrivateKey, Transaction as LTCTransaction, Address } from 'litecore-lib';
import { Transaction } from 'bitcore-lib';
import { Unit } from 'bitcore-lib';
import BTCWallet from "./BTCWallet";
import Blockchair, { Chain } from "./api/Blockchair";

export default class LTCWallet extends BTCWallet {

    get symbol() { return 'ltc'; }
    get chain(): Chain { return 'litecoin'; }

    protected _mainAddress?: string[];
    get mainAddress() {
        if (this._mainAddress) return this._mainAddress;
        let hdKey = this._root.derive(this.getExternalPathIndex(0));
        this._mainAddress = this.genAddress(hdKey);
        return this._mainAddress as string[];
    }

    protected getExternalPath(): string {
        return `m/44'/2'/0'/0`;
    }

    protected getChangePath(): string {
        return `m/44'/2'/0'/1`;
    }

    protected genAddress(key: import("bitcore-lib").HDPrivateKey): string[] {
        let privkey = key['privateKey'].toString();
        return [new PrivateKey(privkey).toAddress(this._network).toString()];
    }

    isValidAddress(addr: string) {
        return Address.isValid(addr);
    }

    scanAddresses(from: number, to: number, external = true, chain = 'litecoin') {
        return super.scanAddresses(from, to, external, chain as any);
    }

    async getTxs(hashes: string[], knownAddresses: string[], symbol: 'litecoin' = 'litecoin'): Promise<TxInfo[]> {
        let txs = await Blockchair.fetchTxs(hashes, 'litecoin');
        if (!txs) return [];

        return txs.map(tx => {
            let inputsValue = tx.inputs.filter(i => knownAddresses.includes(i.recipient)).reduce((prev, curr) => prev + curr.value, 0);
            let outputsValue = tx.outputs.filter(o => knownAddresses.includes(o.recipient)).reduce((prev, curr) => prev + curr.value, 0);
            let amount = Unit.fromSatoshis(outputsValue - inputsValue);

            return <TxInfo>{
                blockHash: '',
                blockHeight: tx.transaction.block_id,
                hash: tx.transaction.hash,
                inputs: tx.inputs.map(i => { return { address: [i.recipient], value: i.value } }),
                outputs: tx.outputs.map(o => { return { address: [o.recipient], value: o.value } }),
                isIncome: outputsValue > inputsValue,
                timestamp: new Date(tx.transaction.time).getTime(),
                amount: amount.toBTC(),
                fee: tx.transaction.fee,
            }
        });
    }

    async genTx(opts: { to: { address: string, amount: number }[]; message?: string | undefined; satoshiPerByte: number }) {
        let totalAmount = opts.to.sum(t => t.amount);
        let utxos = await this.fetchUtxos(totalAmount, this.chain);
        if (utxos.length === 0) return;

        let { tx, change, fee } = this.buildTx({ inputs: utxos, outputs: opts.to, satoshiPerByte: opts.satoshiPerByte, msg: opts.message });
        let hex = tx.serialize() as string;
        let from = utxos.map(u => u.address).distinct().toArray();

        return { hex, id: tx.id as string, change, fee, from, to: opts.to, msg: opts.message };
    }

    buildTx(args: { inputs: IUtxo[], outputs: { address: string, amount: number }[], satoshiPerByte: number, changeIndex?: number, msg?: string }) {
        let keys = this.getKeys(0, 5).concat(this.getKeys(0, 3, false)).map(key => key['privateKey'].toString()).map(privkey => new PrivateKey(privkey));
        let [changeAddr] = this.changes[args.changeIndex === undefined ? Date.now() % this.changes.length : args.changeIndex];

        let utxos = args.inputs.map(i => new LTCTransaction.UnspentOutput(i));
        let tx: Transaction = new LTCTransaction().from(utxos).change(changeAddr).feePerKb((args.satoshiPerByte + 1) * 1000);

        args.outputs.forEach(o => {
            tx.to(o.address, o.amount);
        });

        if (args.msg) {
            let data = Buffer.from(args.msg, 'utf8');
            tx.addData(data);
        }

        tx.sign(<any>keys);

        let fee = tx.getFee();
        let changeAmount = args.inputs.sum(i => i.satoshis) - fee - args.outputs.sum(o => o.amount);
        return { tx, change: { address: changeAddr, amount: changeAmount }, fee };
    }

    // genAddresses(from: number, to: number, external = true): Promise<string[][]> {
    //     return new Promise(resolve => {
    //         if (external) resolve([['LXcyAwWM12jfiW3L4rDLnjBUMXnKA9n3P5']]);
    //         else resolve([['LMWhN3fZb6S7ozamweJWWktdAp147iWWWK']]);
    //     });
    // }
}
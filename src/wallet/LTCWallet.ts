import { Wallet, TxInfo } from "./Wallet";
import { PrivateKey } from 'litecore-lib';
import { observable, computed } from "mobx";
import { Unit } from 'bitcore-lib';
import BTCWallet from "./BTCWallet";
import Blockchair from "./api/Blockchair";

export default class LTCWallet extends BTCWallet {

    transfer(opts: { to: { address: string; amount: string | number; }[]; message?: string | undefined; }) {
        throw new Error("Method not implemented.");
    }

    get symbol() { return 'ltc'; }

    protected _mainAddress?: string[];
    get mainAddress() {
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
        return [new PrivateKey(privkey).toAddress().toString()];
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
                amount: `${amount.toBTC()}`,
            }
        });
    }

    genAddresses(from: number, to: number, external = true): Promise<string[][]> {
        return new Promise(resolve => {
            if (external) resolve([['LXcyAwWM12jfiW3L4rDLnjBUMXnKA9n3P5']]);
            else resolve([['LMWhN3fZb6S7ozamweJWWktdAp147iWWWK']]);
        });
    }
}
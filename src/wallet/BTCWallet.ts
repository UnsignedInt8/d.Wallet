import { Wallet, TxInfo, AddressInfo, IUtxo, IBuildingTx } from "./Wallet";
import { observable, computed } from "mobx";
import * as bitcoin from 'bitcoinjs-lib';
import { HDPrivateKey, Unit, PrivateKey, Transaction, Networks, Address } from "bitcore-lib";
import Blockchair, { Chain } from './api/Blockchair';
import BTCOM from "./api/BTCOM";

console.log('isValid', Address['isValid'])

export default class BTCWallet extends Wallet {

    protected _network?: bitcoin.Network;

    constructor(opts: { root?: HDPrivateKey, mnemonic?: string, path?: string, network?: bitcoin.Network | Networks.Network }) {
        super(opts);
        this._network = opts.network as bitcoin.Network;
    }

    protected getExternalPath(): string {
        return `m/44'/0'/0'/0`;
    }

    protected getChangePath(): string {
        return `m/44'/0'/0'/1`;
    }

    get symbol() { return 'btc'; }
    get chain(): Chain { return 'bitcoin'; }
    protected get refreshingLimit() { return 60 * 6 * 1000; }

    protected _mainAddress?: string[];
    get mainAddress() {
        if (this._mainAddress) return this._mainAddress;
        let key = this._root.derive(super.getExternalPathIndex(0));
        this._mainAddress = this.genAddress(key);
        return this._mainAddress as string[];
    }

    async refresh() {
        if (!this.shouldRefreshing()) return;
        console.warn(`${this.symbol} refreshing`);

        let balance = 0;
        let txs: TxInfo[] = [];

        let info = await this.scanAddresses(0, 1, false);

        balance = info.reduce((prev, curr) => prev + <number>curr.balance, 0);
        txs = txs.concat(info.map(i => i.txs).flatten(false).toArray());

        info = await this.scanAddresses(0, 1);

        balance += info.reduce((prev, curr) => prev + <number>curr.balance, 0);
        txs = txs.concat(info.map(i => i.txs).flatten(false).toArray());

        this.balance = Unit.fromSatoshis(balance).toBTC();

        let oldestTx = this.txs.min(tx => tx.timestamp);
        let oldestTime = oldestTx ? oldestTx.timestamp : 0;
        let newTxs = txs.filter(t => t.timestamp > oldestTime);
        this.txs = newTxs.concat(this.txs).sort((a, b) => b.timestamp - a.timestamp).distinct((i1, i2) => i1.hash === i2.hash).toArray();

        console.log(this.balance, this.txs);
        this.save('balance', this.balance);
        this.save('txs', this.txs);
    }

    isValidAddress(addr: string) {
        return Address['isValid'](addr) || (addr.startsWith('bc') && addr.length === 42);
    }

    async genTx(opts: { to: { address: string, amount: number }[]; message?: string; satoshiPerByte: number }) {
        let totalAmount = opts.to.sum(t => t.amount);
        let utxos = await this.fetchUtxos(totalAmount, this.chain);
        if (utxos.length === 0) return;

        let { tx, change, fee } = this.buildTx({ inputs: utxos, outputs: opts.to, satoshiPerByte: opts.satoshiPerByte, msg: opts.message });
        tx = tx as bitcoin.Transaction;
        let from = utxos.map(u => u.address).distinct().toArray();

        return { hex: tx.toHex(), id: tx.getId(), change, fee, from, to: opts.to, msg: opts.message, value: totalAmount };
    }

    buildTx(args: { inputs: IUtxo[], outputs: { address: string, amount: number }[], satoshiPerByte: number, changeIndex?: number, msg?: string }): IBuildingTx {

        const keys = this.getKeys(0, 5).concat(this.getKeys(0, 3, false));
        const addresses = keys.map(key => {
            let [segwit, legacy] = this.genAddress(key);
            let pubkeyBuf = key.hdPublicKey.publicKey.toBuffer();
            let keyPair = bitcoin.ECPair.fromPrivateKey(key['privateKey'].toBuffer(), { network: this._network });

            const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: pubkeyBuf, network: this._network });
            const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: this._network })

            return { segwit, legacy, pubkey: pubkeyBuf.toString('hex'), key, keyPair, p2wpkh, p2sh };
        });

        const { inputs, outputs } = args;
        const builder = new bitcoin.TransactionBuilder(this._network);

        inputs.forEach((v, i) => {
            let [target] = addresses.filter(a => v.address === a.pubkey || v.address === a.legacy || v.address === a.segwit);
            if (!target) return;
            let { p2wpkh } = target;

            switch (v.type) {
                case 'p2wpkh':
                case 'witness_v0_keyhash':
                case 'P2WPKH_V0':
                    builder.addInput(v.txid, v.vout, undefined, p2wpkh.output);
                    break;

                case 'p2wsh':
                case 'witness_v0_scripthash':
                case 'P2WSH_V0':
                    builder.addInput(v.txid, v.vout);
                    break;

                default:
                    builder.addInput(v.txid, v.vout);
                    break;
            }

        });

        outputs.forEach(o => {
            builder.addOutput(o.address, o.amount);
        });

        if (args.msg) {
            let msg = Buffer.from(args.msg, 'utf8');
            let msgOutput = bitcoin.payments.embed({ data: [msg] }).output!;
            builder.addOutput(msgOutput, 0);
        }

        let txSize = builder.buildIncomplete().byteLength() + 20;

        let totalFee = txSize * (args.satoshiPerByte + 1);
        let totalIn = inputs.sum(i => i.satoshis);
        let totalOut = outputs.sum(o => o.amount);
        let changeAmount = totalIn - totalOut - totalFee;

        let [changeAddr] = this.changes[args.changeIndex === undefined ? Date.now() % this.changes.length : args.changeIndex];
        builder.addOutput(changeAddr, changeAmount);

        inputs.forEach((v, i) => {
            let target = addresses.filter(a => v.address === a.pubkey || v.address === a.legacy || v.address === a.segwit)[0];
            if (!target) return;
            let { keyPair, p2sh } = target;

            switch (v.type) {
                case 'p2wpkh':
                case 'witness_v0_keyhash':
                case 'P2WPKH_V0':
                    builder.sign(i, keyPair, undefined, undefined, v.satoshis);
                    break;

                case 'p2wsh':
                case 'witness_v0_scripthash':
                case 'P2WSH_V0':
                    builder.sign(i, keyPair, p2sh.redeem!.output, undefined, v.satoshis);
                    break;

                default:
                    builder.sign(i, keyPair);
                    break;
            }
        });

        return { tx: builder.build(), change: { address: changeAddr, amount: changeAmount }, fee: totalFee };
    }


    protected genAddress(key: HDPrivateKey) {
        let p2wpkh = bitcoin.payments.p2wpkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        let p2pkh = bitcoin.payments.p2pkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        // let p2sh = bitcoin.payments.p2sh({ redeem: bitcoin.payments.p2wpkh({ pubkey: key.hdPublicKey.publicKey.toBuffer() }), network: this._network });
        // console.log(p2sh);
        return [p2wpkh.address!, p2pkh.address!,];
    }

    async scanAddresses(from: number, to: number, external = true, chain: Chain = 'bitcoin') {
        let addrs = await this.genAddresses(from, to, external);
        let addresses = chain === 'bitcoin-cash' ? addrs.map(a => a[0]) : addrs.flatten(false).toArray();

        let addrsInfo: AddressInfo[] = [];
        let knownTxs: string[] = this.txs.map(t => t.hash);

        for (let addr of addresses) {
            let info = await Blockchair.fetchAddress(addr, chain);
            if (!info) continue;

            let balance = info.address.balance;
            if (info.address.transaction_count === 0) {
                addrsInfo.push({ address: addr, balance, txs: <TxInfo[]>[] });
                continue;
            }

            let unknownTxs = info.transactions.except(knownTxs).take(10).toArray();
            knownTxs = knownTxs.concat(unknownTxs);

            let txs = await this.getTxs(unknownTxs, addresses);

            let addrInfo = { address: addr, balance, txs: txs };
            addrsInfo.push(addrInfo);
        }

        return addrsInfo;
    }

    async getTxs(hashes: string[], knownAddress: string[], symbol = 'btc') {
        let result = await BTCOM.fetchTxs(hashes, symbol as any);
        if (!result) return [];
        let btcTxs = Array.isArray(result) ? result : [result];

        let txs = btcTxs.filter(i => i).map(tx => {
            let inputsValue = tx.inputs.filter(t => t.prev_addresses.some(a => knownAddress.includes(a))).reduce((prev, curr) => (prev + curr.prev_value), 0);
            let outputsValue = tx.outputs.filter(t => t.addresses.some(a => knownAddress.includes(a))).reduce((prev, curr) => prev + curr.value, 0);
            let isIncome = outputsValue > inputsValue;
            let amount = Unit.fromSatoshis(outputsValue - inputsValue);

            return <TxInfo>{
                blockHash: tx.block_hash,
                blockHeight: tx.block_height,
                hash: tx.hash,
                timestamp: tx.created_at,
                inputs: tx.inputs.map(i => { return { address: i.prev_addresses, value: i.prev_value } }),
                outputs: tx.outputs.map(o => { return { address: o.addresses, value: o.value } }),
                isIncome,
                amount: amount.toBTC(),
                fee: tx.fee,
            };
        });

        return txs;
    }

    async scanAddressTx(address: string, knownAddress: string[]) {
        let btcTx = await BTCOM.fetchAddressTx(address, 'btc');

        let txs: TxInfo[] = (btcTx ? btcTx.list : []).map(tx => {
            let fromMe = tx.inputs.filter(t => t.prev_addresses.some(a => knownAddress.includes(a)));
            let toMe = tx.outputs.filter(t => t.addresses.includes(address)).length > 0;

            return <TxInfo>{
                blockHash: tx.block_hash,
                blockHeight: tx.block_height,
                hash: tx.hash,
                timestamp: tx.created_at,
                inputs: tx.inputs.map(i => { return { address: i.prev_addresses, value: i.prev_value } }),
                outputs: tx.outputs.map(o => { return { address: o.addresses, value: o.value } }),
                isIncome: fromMe ? false : toMe,
            };
        });

        return txs;
    }

    // genAddresses(from: number, to: number, external = true): Promise<string[][]> {
    //     return new Promise(resolve => {
    //         resolve([['1BNFNrZSg8JjkyQJZDD3pRD8c72KnRaKy6', '1AnuEWsiBEdUR1qfgXQ7qB9kQetmKZRiKJ']])
    //     });
    // }
}
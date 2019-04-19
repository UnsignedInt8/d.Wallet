// https://github.com/bitcoinjs/bitcoinjs-lib/issues/1176

import BTCWallet from "./BTCWallet";
import { TxInfo, AddressInfo, IUtxo, IBuildingTx } from "./Wallet";
import OmniApi from "./api/OmniExplorer";
import { Chain } from "./api/Blockchair";
import { HDPrivateKey, PrivateKey, Transaction } from "bitcore-lib";
import * as bitcoin from 'bitcoinjs-lib';
import * as assert from 'assert';

export default class USDTWallet extends BTCWallet {

    get symbol() { return 'usdt' };
    get chain(): Chain { return 'bitcoin'; }

    genAddress(key: HDPrivateKey) {
        let p2pkh = bitcoin.payments.p2pkh({ pubkey: key.hdPublicKey.publicKey.toBuffer(), network: this._network });
        return [p2pkh.address!];
    }

    get changes() { return [this.mainAddress]; }

    async scanAddresses(from: number, to: number, external?: boolean): Promise<AddressInfo[]> {
        let addresses = (await this.genAddresses(from, to, external)).map(a => a[1]);

        let info = await OmniApi.fetchAddresses(addresses);
        if (!info) return [];

        let data = await Promise.all(info.map(async (v, i) => {
            let address = addresses[i];
            let usdt = v.balance.filter(i => i.id === '31')[0];
            if (!usdt) return null;

            let omniTxs = await OmniApi.fetchTxs(address) || [];
            let txs = omniTxs.map(t => {
                return <TxInfo>{
                    amount: t.amount,
                    blockHash: t.blockhash,
                    blockHeight: t.block,
                    hash: t.txid,
                    inputs: [{ address: [t.sendingaddress], value: '' }],
                    outputs: [{ address: [t.referenceaddress], value: '' }],
                    isIncome: t.referenceaddress.toLowerCase() === address.toLowerCase(),
                    timestamp: t.blocktime * 1000
                };
            });

            return <AddressInfo>{
                address,
                balance: Number.parseFloat(usdt.value),
                txs,
            };
        }).filter(i => i));

        return <AddressInfo[]>data;
    }

    getTxs(hashes: string[], knownAddresses: string[], symbol = 'usdt'): Promise<TxInfo[]> {
        throw Error('Not implemented');
    }

    async genTx(opts: { to: { address: string, amount: number }[]; message?: string | undefined; satoshiPerByte: number }) {

        let utxos = await this.fetchUtxos(10000, 'bitcoin');
        let { tx, change, fee } = this.buildTx({ inputs: utxos, outputs: opts.to, satoshiPerByte: opts.satoshiPerByte, msg: opts.message }) as { tx: bitcoin.Transaction, change: any, fee: number };

        return { hex: tx.toHex(), id: tx.getId(), change, fee };
    }

    buildTx(args: { inputs: IUtxo[], outputs: { address: string, amount: number }[], satoshiPerByte: number, changeIndex?: number, msg?: string }): IBuildingTx {
        assert(args.outputs.length === 1);

        let { inputs, outputs, satoshiPerByte } = args;
        let builder = new bitcoin.TransactionBuilder(this._network);
        let changeAddr = this.mainAddress[0];
        let addresses = this.getKeys(0, 5).concat(this.getKeys(0, 3, false)).map(key => {
            let [addr] = this.genAddress(key);
            let pubkeyBuf = key.hdPublicKey.publicKey.toBuffer();
            let keyPair = bitcoin.ECPair.fromPrivateKey(key['privateKey'].toBuffer(), { network: this._network });
            const p2pkh = bitcoin.payments.p2pkh({ pubkey: pubkeyBuf, network: this._network });

            return { addr, keyPair, p2pkh, };
        });

        inputs.forEach(i => {
            builder.addInput(i.txid, i.vout);
        });

        let [o] = outputs;
        const dust = 546;
        const simple_send = [
            "6f6d6e69", // omni
            "0000",     // version
            "00000000001f", // 31 for Tether
            (o.amount * 100_000_000).toString(16).padStart(16, '0'), // amount = 10 * 100 000 000 in HEX
        ].join('');

        const data = [Buffer.from(simple_send, "hex")];
        const omniOutput = bitcoin.payments.embed({ data }).output!; // NEW** Payments API
        builder.addOutput(o.address, dust); // dust value, should be first
        builder.addOutput(omniOutput, 0);

        if (args.msg) {
            let msg = Buffer.from(args.msg, 'utf8');
            let msgOutput = bitcoin.payments.embed({ data: [msg] }).output!;
            builder.addOutput(msgOutput, 0);
        }

        let txSize = builder.buildIncomplete().byteLength() + 20;
        let totalFee = txSize * (args.satoshiPerByte + 1);
        let totalUnspent = inputs.sum(i => i.satoshis);
        let changeValue = totalUnspent - dust - totalFee;
        builder.addOutput(changeAddr, changeValue);

        inputs.forEach((v, i) => {
            let [target] = addresses.filter(a => a.addr === v.address);
            if (!target) return;
            let { keyPair } = target;

            builder.sign(i, keyPair);
        });

        return { tx: builder.build(), change: { address: changeAddr, amount: changeValue }, fee: totalFee };
    }

    // genAddresses(from: number, to: number, external = true): Promise<string[][]> {
    //     return new Promise(resolve => {
    //         if (external) resolve([['', '1FoWyxwPXuj4C6abqwhjDWdz6D4PZgYRjA']]);
    //         else resolve([['', '1KYiKJEfdJtap9QX2v9BXJMpz2SfU4pgZw']]);
    //     });
    // }

}
import BTCWallet from "./BTCWallet";
import { Wallet, TxInfo, AddressInfo } from "./Wallet";
import OmniApi from "./api/OmniExplorer";
import { Unit } from 'bitcore-lib';
import { resolve } from "dns";

export default class USDTWallet extends BTCWallet {
    
    get symbol() { return 'usdt' };
    get chain() { return 'bitcoin'; }

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

    // genAddresses(from: number, to: number, external = true): Promise<string[][]> {
    //     return new Promise(resolve => {
    //         if (external) resolve([['', '1FoWyxwPXuj4C6abqwhjDWdz6D4PZgYRjA']]);
    //         else resolve([['', '1KYiKJEfdJtap9QX2v9BXJMpz2SfU4pgZw']]);
    //     });
    // }

}
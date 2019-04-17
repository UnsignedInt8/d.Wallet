import axios from 'axios';
import { BTCAddressObject, BTCTxObject, ETHTxObject, BTCTransaction } from '../../types/BlockChair_Api';
import { TxInfo } from '../Wallet';

export type Chain = 'bitcoin' | 'bitcoin-cash' | 'bitcoin-sv' | 'litecoin' | 'dogecoin';

export default class Blockchair {

    static readonly host = 'https://api.blockchair.com';

    static async fetchAddress(address: string, chain: Chain) {
        let url = `${Blockchair.host}/${chain}/dashboards/address/${address}`;

        try {
            let resp = await axios.get(url);
            if (!resp.data) return null;

            let data = resp.data as BTCAddressObject;
            if (data.context.code !== 200) return null;

            return data.data[address];
        } catch (error) {
            console.log(error);
        }
    }

    static async fetchTxs(hashes: string[], chain: Chain) {
        if (hashes.length === 0) return null;

        let url = `${Blockchair.host}/${chain}/dashboards/transactions/${hashes.join(',')}`;
        let resp = await axios.get(url);

        if (!resp.data) return null;
        let data = resp.data as BTCTxObject;
        if (data.context.code !== 200) return null;

        let btcTxs = hashes.map(hash => data.data[hash]);
        return btcTxs;
    }

    static async fetchETHAddress(address: string) {
        let url = `${Blockchair.host}/ethereum/dashboards/address/${address}`;
        let resp = await axios.get(url);

        if (!resp.data) return null;
        let data = resp.data as ETHTxObject;
        if (data.context.code !== 200) return null;

        return data.data[address.toLowerCase()];
    }

    static async fetchUtxos(address: string, chain: Chain) {
        let url = `${Blockchair.host}/${chain}/outputs?q=is_spent(false),recipient(${address})`;
        let resp = await axios.get(url);

        if (!resp.data) return null;
        let data = resp.data.data as BTCTransaction[] || [];
        return data;
    }
}
import axios from 'axios';
import { BTCAddressObject, BTCTxObject } from '../../types/BlockChair_Api';

type Chain = 'bitcoin' | 'bitcoin-cash' | 'bitcoin-sv' | 'litecoin' | 'dogecoin';
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

    static async fetchTx(hash: string, chain: Chain) {
        let url = `${Blockchair.host}/${chain}/dashboards/transaction/${hash}`;
        let resp = await axios.get(url);

        if (!resp.data) return null;
        let data = resp.data as BTCTxObject;
        if (data.context.code !== 200) return null;

        return data.data[hash];
    }

    static async fetchETHAddress(address: string) {
        let url = `${Blockchair.host}/ethereum/dashboards/address/${address}`;
    }
}
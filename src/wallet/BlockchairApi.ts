import axios from 'axios';
import { BTCAddressObject } from '../types/BlockChair_Api';

export default class Api {

    static readonly host = 'https://api.blockchair.com';

    async fetchAddress(address: string, chain: 'bitcoin' | 'bitcoin-cash' | 'bitcoin-sv' | 'litecoin' | 'dogecoin') {
        let url = `${Api.host}/${chain}/dashboards/address/${address}`;
        let resp = await axios.get(url);
        let data = resp.data as BTCAddressObject;

    }

    async fetchETHAddress(address: string) {
        let url = `${Api.host}/ethereum/dashboards/address/${address}`;
    }
}
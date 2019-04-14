import axios from 'axios';
import { BTCOMAddress, BTCOMAddressTx } from '../../types/BTCOM_Api';

type Symbol = 'btc' | 'bch';

export default class BTCOM {

    static readonly apiHosts = {
        'btc': '',
        'bch': 'bch-chain.',
    }

    static readonly host = 'api.btc.com';

    static async fetchAddress(address: string, symbol: Symbol) {
        const url = `https://${BTCOM.apiHosts[symbol] || ''}${BTCOM.host}/v3/address/${address}`;
        let resp = await axios.get(url);
        if (!resp.data) return null;
        if (resp.data.err_no !== 0) return null;
        return resp.data.data as BTCOMAddress;
    }

    static async fetchAddresses(addresses: string[], symbol: Symbol) {
        const url = `https://${BTCOM.apiHosts[symbol] || ''}${BTCOM.host}/v3/address/${addresses.join(',')}`;
        let resp = await axios.get(url);
        if (!resp.data) return null;
        if (resp.data.err_no !== 0) return null;
        return resp.data.data as BTCOMAddress[];
    }

    static async fetchAddressTx(address: string, symbol: Symbol) {
        const url = `https://${BTCOM.apiHosts[symbol] || ''}${BTCOM.host}/v3/address/${address}/tx`;

        let resp = await axios.get(url);
        if (!resp.data) return null;
        if (resp.data.err_no !== 0) return null;
        return resp.data.data as BTCOMAddressTx;
    }
}
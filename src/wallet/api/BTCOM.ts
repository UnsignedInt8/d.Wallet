import axios, { AxiosResponse } from 'axios';
import { BTCOMAddress, BTCOMAddressTx, BTCOMTx, BTCOMUnspent, BTCOMUnspentList } from '../../types/BTCOM_Api';
import { resolvePtr } from 'dns';

type Symbol = 'btc' | 'bch';

export default class BTCOM {

    static readonly apiHosts = {
        'btc': 'chain.',
        'bch': 'bch-chain.',
    }

    static readonly host = 'api.btc.com';

    static async fetchAddress(address: string, symbol: Symbol) {
        const url = `https://${BTCOM.apiHosts[symbol] || ''}${BTCOM.host}/v3/address/${address}`;
        let resp = await axios.get(url);
        if (!this.checkResp(resp)) return null;

        return resp.data.data as BTCOMAddress;
    }

    static async fetchAddresses(addresses: string[], symbol: Symbol) {
        if (addresses.length === 0) return null;

        const url = `https://${BTCOM.apiHosts[symbol] || ''}${BTCOM.host}/v3/address/${addresses.length > 1 ? addresses.join(',') : addresses[0]}`;
        let resp = await axios.get(url);
        if (!this.checkResp(resp)) return null;

        if (addresses.length > 1) return resp.data.data as BTCOMAddress[];
        return resp.data.data as BTCOMAddress;
    }

    static async fetchAddressTx(address: string, symbol: Symbol) {
        const url = `https://${BTCOM.apiHosts[symbol] || ''}${BTCOM.host}/v3/address/${address}/tx`;

        let resp = await axios.get(url);
        if (!this.checkResp(resp)) return null;

        return resp.data.data as BTCOMAddressTx;
    }

    static async fetchAddressUnspent(address: string, page = 1, symbol: Symbol) {
        const url = `https://${BTCOM.apiHosts[symbol] || ''}${BTCOM.host}/v3/address/${address}/unspent&page=${page}`;

        let resp = await axios.get(url);
        if (!this.checkResp(resp)) return null;

        return resp.data.data as BTCOMUnspentList;
    }

    static async fetchTxs(txs: string[], symbol: Symbol) {
        if (txs.length === 0) return null;

        const url = `https://${BTCOM.apiHosts[symbol]}${BTCOM.host}/v3/tx/${txs.length > 1 ? txs.join(',') : txs[0]}`;
        
        let resp = await axios.get(url);
        if (!this.checkResp(resp)) return null;
        
        if (txs.length > 0) return resp.data.data as BTCOMTx[];
        else return resp.data.data as BTCOMTx;
    }

    static async fetchTx(hash: string, symbol: Symbol) {
        const url = `https://${BTCOM.apiHosts[symbol]}${BTCOM.host}/v3/tx/${hash}`;
        let resp = await axios.get(url);
        if (!this.checkResp(resp)) return null;
        return resp.data.data as BTCOMTx;
    }

    static checkResp(resp: AxiosResponse<any>) {
        if (!resp.data) return false;
        if (resp.data.err_no !== 0) return false;
        if (typeof (resp.data) === 'string') return false;
        return true;
    }
}
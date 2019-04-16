import axios from 'axios';
import { OmniAddress, OmniAddressTx } from '../../types/Omni_API';

export default class OmniApi {

    static readonly host = 'https://api.omniexplorer.info';

    static async fetchAddresses(addresses: string[]) {
        let url = `${OmniApi.host}/v2/address/addr/`;
        let form = new FormData();
        addresses.forEach(addr => form.append('addr', addr));

        let resp = await axios.post(url, form);

        if (!resp.data) return null;
        let data = addresses.map(addr => resp.data[addr.trim()] as OmniAddress);
        return data;
    }

    static async fetchTxs(address: string) {
        let url = `${OmniApi.host}/v1/transaction/address`;
        let form = new FormData();
        form.append('addr', address);
        form.append('page', '0');

        let resp = await axios.post(url, form);
        if (!resp.data) return null;
        let data = resp.data as OmniAddressTx;
        return data.transactions;
    }
}
import BTCWallet from "../../src/wallet/BTCWallet";
import ETHWallet from "../../src/wallet/ETHWallet";
import * as bitcoin from "bitcoinjs-lib";
import { Transaction, HDPrivateKey, PublicKey } from "bitcore-lib";
import * as Mnemonic from 'bitcore-mnemonic';
import * as linq from 'linq';
import Blockchair from "../../src/wallet/api/Blockchair";
linq.enable();

describe('Blockchair API', () => {

    it('fetchs utxos', async () => {
        let utxos = await Blockchair.fetchUtxos('bc1qzjeg3h996kw24zrg69nge97fw8jc4v7v7yznftzk06j3429t52vse9tkp9', 'bitcoin');
        if (!utxos) return;
        expect(utxos.length).toBeGreaterThan(0);
    });
});
import BTCWallet from "../../src/wallet/BTCWallet";
import ETHWallet from "../../src/wallet/ETHWallet";
import * as bitcoin from "bitcoinjs-lib";
import { Transaction, HDPrivateKey, PublicKey, } from "bitcore-lib";
import { Networks as BCHNetworks } from 'bitcore-lib-cash';
import { Networks as LTCNetworks } from 'litecore-lib';
import * as Mnemonic from 'bitcore-mnemonic';
import * as linq from 'linq';
import BCHWallet from "../../src/wallet/BCHWallet";
import LTCWallet from "../../src/wallet/LTCWallet";
import USDTWallet from "../../src/wallet/USDTWallet";
import * as hex2dec from 'hex2dec';
import * as ETHUnit from 'ethjs-unit';
import * as keythereum from 'keythereum';

linq.enable();

describe('ETH Wallet', () => {
    const mnemonic = 'nerve shop cabbage skate predict rain model sustain patch grocery solution release';
    let wallet = new ETHWallet({ mnemonic });

    it(`test eth hex`, () => {
        let key = `{
    "address": "bf8ea4663182e9dc190b1b8c2b4076f5ad09f2dd",
    "crypto": {
        "cipher": "aes-128-ctr",
        "ciphertext": "83b2a758385c1d4932ab4066972a5e710119de7a9f2eea8df662b1d9b1f9b968",
        "cipherparams": {
            "iv": "2ca1260b8db4abb5941c9e7547a93df2"
        },
        "kdf": "scrypt",
        "kdfparams": {
            "dklen": 32,
            "n": 262144,
            "p": 1,
            "r": 8,
            "salt": "28b91debdb27c9cc4e9cc5446d90208bedee08cb257160d6b15e15b334c1b2b2"
        },
        "mac": "da3ec718a6672b96c7a0aa67b1fdddcb4d46e373e3e99a1d27da296aabddd75c"
    },
    "id": "ec61122b-0bcf-4745-bd09-590703c78abb",
    "version": 3,
    "balance": 0.01962684
}`;

        let keystore = JSON.parse(key);
        let privkey: Buffer;

        try {
            privkey = keythereum.recover('static2018test', keystore);
        } catch{
            privkey = keythereum.recover('test', keystore);
        }

        let amount = ETHUnit.toWei(0.01962684, 'ether').toString();
        let gasPrice = ETHUnit.toWei(4, 'gwei').toString();

        let { hex, txid, fee, value } = wallet.buildETHTx({ to: { address: '0x4c094a9c4e494ef7546efd950c9c75613cbba771', amount }, gasPrice, nonce: 2 },
            0.01962684, privkey);

        expect(hex).toBe('0xf86a0284ee6b2800825208944c094a9c4e494ef7546efd950c9c75613cbba77187456e1c041a30008025a0fce92224ebf7df6f42bd4e0acab1c562894e3933e5a862edeb22b8ab5eed0cf9a0119afed9a86fb9c98df9e8109d5db302ba6cf712793d872adaa03be411c5a885');
        expect(txid).toBe('0x603aebdffa14397b03d1cf943eca0446ea15b306f9c750de27c757bc4d8726ed');
        expect(fee).toBe('84000000000000');
        expect(value).toBe('19542840000000000');
    });
});
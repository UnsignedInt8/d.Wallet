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

    it(`test tx with a message`, () => {
        let keystore = JSON.parse(`{
            "address": "d4dabb5cfbaecdae0b9ca145bcb6e2daffaba41b",
            "crypto": {
                "cipher": "aes-128-ctr",
                "ciphertext": "74e3ecd0b885e7164dfce627ca319dc6243701c6f435e20be6746e5b07bc562d",
                "cipherparams": {
                    "iv": "c058cd0cbf6f00825bba8ebb532fede6"
                },
                "kdf": "scrypt",
                "kdfparams": {
                    "dklen": 32,
                    "n": 262144,
                    "p": 1,
                    "r": 8,
                    "salt": "8a73b22873e528b088f7a77e7e18b44f3ed2fca641e30257b3f8101cf1d1741d"
                },
                "mac": "52d311bd5b797c10aba3b167bdf41c402ca5edeebcce314dadd1b4897da6ef7b"
            },
            "id": "12b0cd34-51d6-4ac6-9c30-18e09f18a887",
            "version": 3,
            "balance": 0.01096278
        }`);

        const balance = 0.01096278;
        let privkey: Buffer;
        try {
            privkey = keythereum.recover('static2018test', keystore);
        } catch{
            privkey = keythereum.recover('test', keystore);
        }

        // console.log(privkey.toString('hex'));

        let gasPrice = ETHUnit.toWei(4, 'gwei').toString();
        let amount = ETHUnit.toWei(balance, 'ether').toString();
        let msg = 'Cryptocurrency is the future';

        // console.log('msg', Buffer.from(msg, 'utf8').toString('hex'));

        let result = wallet.buildETHTx({
            to: { address: wallet.mainAddress[0], amount },
            msg: msg,
            gasPrice,
            nonce: 1,
        }, balance, privkey);

        // console.log(result);
        expect(result.hex).toBe('0xf8860184ee6b2800825978944c094a9c4e494ef7546efd950c9c75613cbba77187269f441c83d8009c43727970746f63757272656e6379206973207468652066757475726525a029cc685328ec02a9ebca60fda511cc20f797169b89e533792fd51bfc40ebf1bda0478d1062ace67ed456e0afab20c149424802062431bc38e25133edeea9fe62ff');
        expect(result.txid).toBe('0xb7ffba5bf13a2835dad4bc18b5e287f10a96bebe5629abded2cd80f4e59384ec');
        expect(result.fee).toBe('91616000000000');
        expect(result.value).toBe('10871164000000000');

    });
});
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
            "address": "7209b40cd5cd0b39743de0f84a1a9a0003d6fd75",
            "crypto": {
                "cipher": "aes-128-ctr",
                "ciphertext": "6c39453cfd0433229d233a1e926ae654e81eba5f17fe7e2becf9e3dc6729c41e",
                "cipherparams": {
                    "iv": "ca8c9d9ad4581edec6d530f1bd2b5ae4"
                },
                "kdf": "scrypt",
                "kdfparams": {
                    "dklen": 32,
                    "n": 262144,
                    "p": 1,
                    "r": 8,
                    "salt": "e9688b035cb723fd034661bc1907461e48eaf1303e2db491b8311009fd9ec123"
                },
                "mac": "ebe55887656b219f41b69403c8ef537bd5aade1193ef0d286a8560daac12e786"
            },
            "id": "891d6b67-e4e3-47e5-81c9-cadb84bfcc01",
            "version": 3,
            "balance": 0.00096278
        }`);

        const balance = 0.00096278;
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

        expect(result.hex).toBe('0xf8860184ee6b2800825978944c094a9c4e494ef7546efd950c9c75613cbba77187031851acc2d8009c43727970746f63757272656e6379206973207468652066757475726526a018b7982ee944c9d9cecbe9982c6a0cdb1397742d629bb21b24fe3263a2f38875a03c764a48cf251270f6c48a5e7d178e21487826b9e667968730f702e6c48e79a2');
        expect(result.txid).toBe('0xb53365ffa1a0359b37d3f3f3c67593f8f098fc69c27301a4a12b2a33dadcd86e');
        expect(result.fee).toBe('91616000000000');
        expect(result.value).toBe('871164000000000');

    });
});
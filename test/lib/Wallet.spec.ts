import BTCWallet from "../../src/wallet/BTCWallet";
import ETHWallet from "../../src/wallet/ETHWallet";
import * as bitcoin from "bitcoinjs-lib";
import { Transaction, HDPrivateKey, PublicKey } from "bitcore-lib";
import * as Mnemonic from 'bitcore-mnemonic';
import * as linq from 'linq';
linq.enable();

const mnemonic = 'nerve shop cabbage skate predict rain model sustain patch grocery solution release';

describe('tests wallets', () => {

    it('tests address', () => {
        let btc = new BTCWallet({ mnemonic, });
        expect(btc.mainAddress).toContain('1PNUBxhi6fDh3DKV374raZPuXQ5GbABBzV');

        let btcsegwit = new BTCWallet({ mnemonic, });
        expect(btcsegwit.mainAddress).toContain('bc1q743r9kknlyjeshzmprrzglsdzz5uha5xa46wdp');

        let eth = new ETHWallet({ mnemonic, });
        expect(eth.mainAddress).toContain('0x4c094a9c4E494Ef7546EfD950c9C75613cbbA771'.toLowerCase());
    });

    it('test pubkey to address', () => {
        let pubkey = '701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d';
        let pubey2 = '022525b7fd2da568ff645a40bc7fcb897294346fd21fbd4f2535a372dd173b790d';

        let pk = new PublicKey(pubey2);
        let p2pkh = bitcoin.payments.p2pkh({ pubkey: pk.toBuffer(), });

        expect(p2pkh.address).toEqual(pk['toAddress']().toString())
    });


    it('builds raw tx', () => {

        let btc = new BTCWallet({ mnemonic, network: bitcoin.networks.regtest });
        let { tx: sendTx, change, fee } = btc.buildTx({
            inputs: [{ txid: 'f8c34d7fffbce87831c2fc38b4f3fbaa5fc3ba3bbabce1322f0405656805e605', vout: 1, amount: 50100000000, pubkey: 'bcrt1q743r9kknlyjeshzmprrzglsdzz5uha5x46cspm' }],
            outputs: [{ address: '2N2S7vggiwYHVsjZLxsKPdyUwS6AbYYjKFH', amount: 5000 }],
            satoshiPerByte: 50,
            changeIndex: 1,
        });

        let hash = sendTx.getId();
        expect(hash).toBe('efa9011ea4c5c1408f5affdb5a607b16306b1a32af8a63fc874659f40982fea4');

        let hex = sendTx.toHex();
        expect(hex).toBe('0200000000010105e605686505042f32e1bcba3bbac35faafbf3b438fcc23178e8bcff7f4dc3f80100000000ffffffff02881300000000000017a91464c8a5b4bb1383a5fefb034fcade577c7d48eaf187f32c31aa0b00000016001460050470523c3a9cc151e45dbf1c9254f840b8c9024730440220318fc0d34b286c0700b6bef20ee8856d0e42259f5d3d1854aa307f70888c2d4c02205ccb19b36cd4885d172f6f14a0d4df95386ae45909acdc897f39c76ecdd2c07f01210309f0c6b887e593f171312976f515b851d0ce2cd083a6a8bb812c7266bc8a236600000000');

        console.log(change, fee);
        console.log(hash);
        console.log(hex);
    })

});
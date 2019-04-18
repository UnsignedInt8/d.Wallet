import BTCWallet from "../../src/wallet/BTCWallet";
import ETHWallet from "../../src/wallet/ETHWallet";
import * as bitcoin from "bitcoinjs-lib";
import { Transaction, HDPrivateKey, PublicKey, } from "bitcore-lib";
import { Networks } from 'bitcore-lib-cash';
import * as Mnemonic from 'bitcore-mnemonic';
import * as linq from 'linq';
import BCHWallet from "../../src/wallet/BCHWallet";
linq.enable();

const mnemonic = 'nerve shop cabbage skate predict rain model sustain patch grocery solution release';

describe('tests wallets', () => {
    let btc = new BTCWallet({ mnemonic, network: bitcoin.networks.regtest });

    it('tests address', () => {
        let btc = new BTCWallet({ mnemonic, });
        expect(btc.mainAddress).toContain('1PNUBxhi6fDh3DKV374raZPuXQ5GbABBzV');

        let btcsegwit = new BTCWallet({ mnemonic, });
        expect(btcsegwit.mainAddress).toContain('bc1q743r9kknlyjeshzmprrzglsdzz5uha5xa46wdp');

        let eth = new ETHWallet({ mnemonic, });
        expect(eth.mainAddress).toContain('0x4c094a9c4E494Ef7546EfD950c9C75613cbbA771'.toLowerCase());

        let btctest = new BTCWallet({ mnemonic, network: bitcoin.networks.regtest });
        expect(btctest.mainAddress[1]).toBe('n3tRV1ngugewpKo6kg3EQUcEPPfyafUXgW');
    });

    it('test pubkey to address', () => {
        let pubkey = '701a8d401c84fb13e6baf169d59684e17abd9fa216c8cc5b9fc63d622ff8c58d';
        let pubey2 = '022525b7fd2da568ff645a40bc7fcb897294346fd21fbd4f2535a372dd173b790d';

        let pk = new PublicKey(pubey2);
        let p2pkh = bitcoin.payments.p2pkh({ pubkey: pk.toBuffer(), });

        expect(p2pkh.address).toEqual(pk['toAddress']().toString())
    });


    it('builds p2wpkh input tx', () => {
        let { tx: sendTx, change, fee } = btc.buildTx({
            inputs: [{ type: 'p2wpkh', txid: 'f8c34d7fffbce87831c2fc38b4f3fbaa5fc3ba3bbabce1322f0405656805e605', vout: 1, satoshis: 50100000000, address: 'bcrt1q743r9kknlyjeshzmprrzglsdzz5uha5x46cspm' }],
            outputs: [{ address: '2N2S7vggiwYHVsjZLxsKPdyUwS6AbYYjKFH', amount: 5000 }],
            satoshiPerByte: 50,
            changeIndex: 1,
        });
        sendTx = sendTx as bitcoin.Transaction;

        let hash = sendTx.getId();
        expect(hash).toBe('efa9011ea4c5c1408f5affdb5a607b16306b1a32af8a63fc874659f40982fea4');

        let hex = sendTx.toHex();
        expect(hex).toBe('0200000000010105e605686505042f32e1bcba3bbac35faafbf3b438fcc23178e8bcff7f4dc3f80100000000ffffffff02881300000000000017a91464c8a5b4bb1383a5fefb034fcade577c7d48eaf187f32c31aa0b00000016001460050470523c3a9cc151e45dbf1c9254f840b8c9024730440220318fc0d34b286c0700b6bef20ee8856d0e42259f5d3d1854aa307f70888c2d4c02205ccb19b36cd4885d172f6f14a0d4df95386ae45909acdc897f39c76ecdd2c07f01210309f0c6b887e593f171312976f515b851d0ce2cd083a6a8bb812c7266bc8a236600000000');
    });

    it('builds p2pkh input tx', () => {
        let { tx, change, fee } = btc.buildTx({
            inputs: [{ type: 'p2sh', txid: '8261550ab9265e3dbf843ae7f425284050dc05fa084dde3a8bcc3afb40190475', vout: 0, satoshis: 500000000, address: 'n3tRV1ngugewpKo6kg3EQUcEPPfyafUXgW' }],
            outputs: [{ address: '2N2S7vggiwYHVsjZLxsKPdyUwS6AbYYjKFH', amount: 5000 }],
            satoshiPerByte: 30,
            changeIndex: 0,
        });
        tx = tx as bitcoin.Transaction;

        let hash = tx.getId();
        let hex = tx.toHex();

        expect(hash).toBe('326416ab86ef62737ad934f700eec1d7743e9c303d0d95f2457770928dcf8a8c');
        expect(hex).toBe('020000000175041940fb3acc8b3ade4d08fa05dc50402825f4e73a84bf3d5e26b90a556182000000006a473044022018f9b91a42430fe963f1cd7f5b84425667b7faa3210c7bf088a29a293245d61902201f15cc4b0aad9aab14015f176c16ff90708265cdda320f761b6da91757cfc16301210309f0c6b887e593f171312976f515b851d0ce2cd083a6a8bb812c7266bc8a2366ffffffff02881300000000000017a91464c8a5b4bb1383a5fefb034fcade577c7d48eaf187ff44cd1d00000000160014edafd95fec3d557b4dc993dd2ce88a0fc793abd700000000');

    });

    it('builds bch tx', () => {
        let bch = new BCHWallet({ mnemonic, network: Networks.regtest });
        console.log(bch.mainAddress);

        let { tx, change, fee } = bch.buildTx({
            inputs: [{
                type: 'pubkeyhash',
                txid: 'f18ff5c589154698bd514a24468cd8dbcf23318ee615e3321b51b0eed1742cb0',
                vout: 1,
                satoshis: 1000000000,
                address: 'qrpm606h3ly5xpqahqazznyrv78ge56z3u9mjha5kd',
                script: '76a914c3bd3f578fc943041db83a214c83678e8cd3428f88ac'
            }],
            outputs: [{ address: 'qp065lffke6wq3dup8jnegsx28st43qg3qpctr6w9s', amount: 5000 }],
            satoshiPerByte: 30,
            changeIndex: 0,
        });

        let hex = tx.serialize();
        let id = tx.id;

        expect(hex).toBe('0100000001b02c74d1eeb0511b32e315e68e3123cfdbd88c46244a51bd98461589c5f58ff1010000006a473044022065fe0b86fd394e80da4d89d9b5878c3968c942b96b7427522eacb9d94f449b6402207827545f6e9bb376affb142d9e557e648f14bbe3c26bedcf677b49b7e91ef2fd412103eb63fdcd9c5dc4ec348c787f008325884693f637901219f61b5673e9c7e1920effffffff0288130000000000001976a9145faa7d29b674e045bc09e53ca20651e0bac4088888acbd9a9a3b000000001976a91415c52fa6f60884974e33f573366b85a39251966788ac00000000');
        expect(id).toBe('65bfcf5a7d09f638cff099f5b34cead9739580b51ea88222ddeacec6c17f0d6d');

    });
});
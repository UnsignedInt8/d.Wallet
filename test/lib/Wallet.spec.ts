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
    let bch = new BCHWallet({ mnemonic, network: Networks.regtest });

    // console.log(btc.addresses);

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

    it('builds multiple inputs(p2wpkh, p2pkh)/outputs tx', () => {
        let { tx, change, fee } = btc.buildTx({
            inputs: [
                { txid: '562bf7ba9d8e06c4edf94800aac34f69eaf33280925b5ee4bed062b3c63f730e', vout: 1, type: 'p2wpkh', satoshis: 1000000000, address: 'bcrt1q743r9kknlyjeshzmprrzglsdzz5uha5x46cspm', },
                { txid: '58d54be2615dd2c5700098ce6fef20e9b2f2c5989aea21f7620e62f0b7e5be39', vout: 1, type: 'p2wpkh', satoshis: 100000000, address: 'bcrt1q743r9kknlyjeshzmprrzglsdzz5uha5x46cspm' },
                { txid: '22eaa017325a5be2cde9d365434865c5a0e23e8a343678170520105211256e68', vout: 1, type: 'p2pkh', satoshis: 100000000, address: 'mydkTi5hnbvczxg5U24RjFoJBdoXLRHAeM' }
            ],
            outputs: [
                { address: '2N52fVaMxUqQXv1scJHr251yTzxoPZ71Amf', amount: 200000 },
                { address: '2NAxh8CY5K6DsRSDqwMY1kccKWEkCaQiMu6', amount: 55000 },
            ],
            satoshiPerByte: 25,
            changeIndex: 2,
        });

        tx = tx as bitcoin.Transaction;

        let hex = tx.toHex();
        let id = tx.getId();

        expect(hex).toBe('020000000001030e733fc6b362d0bee45e5b928032f3ea694fc3aa0048f9edc4068e9dbaf72b560100000000ffffffff39bee5b7f0620e62f721ea9a98c5f2b2e920ef6fce980070c5d25d61e24bd5580100000000ffffffff686e251152102005177836348a3ee2a0c565484365d3e9cde25b5a3217a0ea22010000006b4830450221008231efa38c832f575810b04cdb9c2efe353c8b522f1b424cb01aa66517e9a38302205e6379133f57a33cf120080894b8ba9b1665e0175553182f91e67928c44163500121025feaa6e8741e04d3414c0dea1844068a1043f02ca6934c71381fca47762ffcfeffffffff03400d03000000000017a91481416476861a652f641453407324e29b0836eb6f87d8d600000000000017a914c251d85bb1581d575db56308d223883d72701f6f87de9182470000000016001410831c6c440a0b24044118a7bce384e0dc9f657c02473044022050e242f0085f3ff5494bc7b5cebebfb5c6ad5c90ba8c0c68cdeef16899edab0802203d2163c00fa03b9e03fb030da139b2e48472e97f82fa5ba166de13d1a84be59301210309f0c6b887e593f171312976f515b851d0ce2cd083a6a8bb812c7266bc8a236602473044022035a99f3b7b4333239948dc7cfdafc6cda07afabf2f27abb22a2d88353401ae3c0220052e39b96b22cbfcbc561681414673fde1d1b0d03d76734020817e5bea27d49601210309f0c6b887e593f171312976f515b851d0ce2cd083a6a8bb812c7266bc8a23660000000000');
        expect(id).toBe('c0a3dd807c1d956f3e6e3b315cb95f2494c6aa32e9d621f8ae3e810a046b04de');
    });

    it('builds bch tx', () => {
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

    it('builds mutliple bch inputs/outputs tx', () => {
        let { tx, change, fee } = bch.buildTx({
            inputs: [
                { type: 'pubkeyhash', txid: '0a88f208c781f612f5c06ab8a2eab061c4f83db0bf6b406e4ad4485ae4d7173e', vout: 1, satoshis: 1000000000, address: 'qrpm606h3ly5xpqahqazznyrv78ge56z3u9mjha5kd', script: '76a914c3bd3f578fc943041db83a214c83678e8cd3428f88ac' },
                { type: 'pubkeyhash', txid: '68b032f7a520d2230563c3c178ff19585e028ab997fcbcd7bf7c5c66ceb058fc', vout: 1, satoshis: 1000000000, address: 'qrpm606h3ly5xpqahqazznyrv78ge56z3u9mjha5kd', script: '76a914c3bd3f578fc943041db83a214c83678e8cd3428f88ac' }
            ],
            outputs: [
                { address: 'qp8y7v9s0f0x24k5uf3zct0vhwek6hx5kq5dzrat4z', amount: 3000 },
                { address: 'qrdt0n0vcee83h5jyzhawgcmwcd2dqkgq5zv5cdtv2', amount: 5000 },
            ],
            satoshiPerByte: 1,
            changeIndex: 1
        });

        let hex = tx.serialize();
        let id = tx.id;

        expect(hex).toBe('01000000023e17d7e45a48d44a6e406bbfb03df8c461b0eaa2b86ac0f512f681c708f2880a010000006b483045022100da7131760628a3ed8e3a7f7e9343cb5e9dec8e6311c1c61fd4e284be9a42a34e02200dfb3d22326fc86458375fe5ef276343cd4b9dba452f41a44738c67f2a716f6e412103eb63fdcd9c5dc4ec348c787f008325884693f637901219f61b5673e9c7e1920efffffffffc58b0ce665c7cbfd7bcfc97b98a025e5819ff78c1c3630523d220a5f732b068010000006b4830450221008095cc4ba60de30cff1ea96e376a13a9dd461988c0d4105ccc8b44cc9fa2121302202ba47359d221ea365f83648aad25cf2217a6b07b349ae11c2f3ddb8f3dc64174412103eb63fdcd9c5dc4ec348c787f008325884693f637901219f61b5673e9c7e1920effffffff03b80b0000000000001976a9144e4f30b07a5e6556d4e2622c2decbbb36d5cd4b088ac88130000000000001976a914dab7cdecc67278de9220afd7231b761aa682c80588acdc713577000000001976a9141c6da11480942d7a8e5fc9187cf08213023c013488ac00000000');
        expect(id).toBe('e93d30ecd38108f33ca5d797533735ef4ed49d6945044fe7824a8ff56f24bd01');
    });
});
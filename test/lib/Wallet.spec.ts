import BTCWallet from "../../src/wallet/BTCWallet";
import ETHWallet from "../../src/wallet/ETHWallet";
import * as bitcoin from "bitcoinjs-lib";

const mnemonic = 'nerve shop cabbage skate predict rain model sustain patch grocery solution release';

describe('tests wallets', () => {

    it('tests address', () => {
        let btc = new BTCWallet({ mnemonic, segwit: false });
        expect(btc.mainAddress).toBe('1PNUBxhi6fDh3DKV374raZPuXQ5GbABBzV');

        let btcsegwit = new BTCWallet({ mnemonic, });
        expect(btcsegwit.mainAddress).toBe('bc1q743r9kknlyjeshzmprrzglsdzz5uha5xa46wdp');

        let eth = new ETHWallet({ mnemonic, });
        expect(eth.mainAddress).toBe('0x4c094a9c4E494Ef7546EfD950c9C75613cbbA771'.toLowerCase());
    });
});
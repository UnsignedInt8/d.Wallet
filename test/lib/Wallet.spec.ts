import BTCWallet from "../../src/wallet/BTCWallet";
import ETHWallet from "../../src/wallet/ETHWallet";

const mnemonic = 'nerve shop cabbage skate predict rain model sustain patch grocery solution release';

describe('tests wallets', () => {

    it('tests address', () => {
        let btc = new BTCWallet({ mnemonic, segwit: false });
        expect(btc.address).toBe('1PNUBxhi6fDh3DKV374raZPuXQ5GbABBzV');

        let eth = new ETHWallet({ mnemonic, });
        expect(eth.address).toBe('0x4c094a9c4E494Ef7546EfD950c9C75613cbbA771');
    });
});
import * as Mnemonic from 'bitcore-mnemonic';
import { HDPrivateKey } from 'bitcore-lib';
import BCH from './BCHWallet';
import BTC from './BTCWallet';
import ETH from './ETHWallet';
import LTC from './LTCWallet';
import USDT from './USDTWallet';
import { observable } from 'mobx';
import { Wallet } from './Wallet';

const supportedWallets = { 'btc': BTC, 'bch': BCH, 'eth': ETH, 'ltc': LTC, 'usdt': USDT };

export class WalletManager {

    wallets: { [index: string]: Wallet } = {};

    constructor(mnemonic: string) {
        if (!mnemonic) throw new Error('invalid mnemonic');

        let seed = new Mnemonic(mnemonic);
        let root = seed.toHDPrivateKey();

        Object.getOwnPropertyNames(supportedWallets).forEach(key => {
            this.wallets[key] = new supportedWallets[key]({ root });
        });

        this.current = this.wallets['btc'];
    }

    @observable current: Wallet;

    selectWallet(symbol: string) {
        this.current = this.wallets[symbol] || this.current;
        this.current.refresh();
    }

    autoRefresh() {
        this.refresh();
        setInterval(async () => await this.refresh(), 10 * 60 * 1000);
    }

    async refresh() {
        let keys = Object.getOwnPropertyNames(this.wallets);

        for (let key of keys) {
            await this.wallets[key].refresh();
        }
    }
}

let singleton: WalletManager;

export function getWalletMan(mnemonic: string) {
    if (singleton) return singleton;
    singleton = new WalletManager(mnemonic);
    return singleton;
}
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

    private wallets: { [index: string]: Wallet } = {};

    constructor(mnemonic: string) {
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

    refresh() {
        this.wallets['ltc'].refresh();
    }
}

let singleton: WalletManager;

export function getWalletMan(mnemonic: string) {
    if (singleton) return singleton;
    singleton = new WalletManager(mnemonic);
    return singleton;
}
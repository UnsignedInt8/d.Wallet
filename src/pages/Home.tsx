import * as React from 'react';
import { Flip, Fade } from 'react-reveal';
import '../styles/Home.scss';
import { platform } from 'os';
import { AreaChart, Area } from 'recharts';
import CoinRanking, { Coins } from '../api/CoinRanking';
import PassMan from '../data/PasswordManager';
import Send from './Send';
import Receive from './Receive';
import anime from 'animejs';
import Settings from './Settings';
import { AppSettings, getAppSettings } from '../data/AppSettings';
import { Wallet } from '../wallet/Wallet';
import BTCWallet from '../wallet/BTCWallet';
import ETHWallet from '../wallet/ETHWallet';
import BCHWallet from '../wallet/BCHWallet';
import LTCWallet from '../wallet/LTCWallet';
import { WalletManager, getWalletMan } from '../wallet/WalletManager';
import { observer } from 'mobx-react';
import Axios from 'axios';
import AnimeHelper from '../lib/AnimeHelper';
import StickyEvents from 'sticky-events';
import OmniApi from '../wallet/api/OmniExplorer';

const btc = require('../assets/btc.svg');
const eth = require('../assets/eth.svg');
const bch = require('../assets/bch.svg');
const ltc = require('../assets/ltc.svg');
const usdt = require('../assets/usdt.svg');
const settings = require('../assets/menu.svg');
const send = require('../assets/send.svg');
const inIcon = require('../assets/in.svg');
const outIcon = require('../assets/out.svg');
const qrcode = require('../assets/qrcode.svg');

const symbols = [
    { img: btc, symbol: 'btc', color: '#f7931a' },
    { img: eth, symbol: 'eth', color: '#627eea' },
    { img: bch, symbol: 'bch', color: '#8dc351' },
    { img: ltc, symbol: 'ltc', color: '#bfbbbb' },
    { img: usdt, symbol: 'usdt', color: '#26a17b' }];

interface HomeState {
    selectedSymbol: string;
    showSymbol: boolean;
    symbolColor: string;
    currentPrice: string;
    currentChange: number;
    currentHistory?: { price: string, timestamp: number }[];

    showBalance: boolean;
    expandSending: boolean;
    expandReceiving: boolean;
    expandSettings?: boolean;
    stuck?: boolean;
}

@observer
class Home extends React.Component<{}, HomeState> {

    state: HomeState = {
        selectedSymbol: 'btc', showSymbol: true, symbolColor: symbols[0].color,
        currentPrice: '', currentChange: 0, currentHistory: [],
        expandSending: false, expandReceiving: false, expandSettings: false,
        showBalance: true,
    };
    walletMan!: WalletManager;
    private refersher?: NodeJS.Timer | number;
    private history = {};
    private appSettings?: AppSettings;

    componentDidMount() {
        this.refersher = setInterval(() => this.refreshPrice(), 30 * 1000);
        this.refreshPrice();
        this.refreshHistory();

        if (PassMan.password) this.appSettings = getAppSettings(PassMan.password);
        PassMan.on('password', this.onPasswordChanged);

        if (PassMan.password) {
            this.onPasswordChanged();
        }

        this.hookSticky();
    }

    componentWillUnmount() {
        clearInterval(this.refersher as NodeJS.Timer);
        PassMan.removeListener('password', this.onPasswordChanged)
    }

    private hookSticky() {
        let observer = new IntersectionObserver(
            entries => {
                let [item] = entries;
                if (item.isIntersecting) {
                    this.setState({ stuck: false });
                } else {
                    this.setState({ stuck: true });
                }
            }
        );

        observer.observe(document.querySelector('.price')!);
    }

    private onPasswordChanged = () => {
        this.appSettings = getAppSettings(PassMan.password);
        this.walletMan = getWalletMan(this.appSettings.mnemonic);

        this.walletMan.refresh();
    }

    private async refreshPrice() {
        let result = await CoinRanking.fetchPrice(this.state.selectedSymbol as Coins)
        if (!result) return;
        this.setState({ currentPrice: Number.parseFloat(result.price).toFixed(2), currentChange: result.change });
    }

    private async refreshHistory() {
        let now = Date.now() - 10 * 3600 * 1000;
        let data = history[this.state.selectedSymbol];
        if (data && data.time > now) {
            this.setState({ currentHistory: data.history });
            return;
        }

        let result = await CoinRanking.fetchHistory(this.state.selectedSymbol as Coins);
        if (!result) return;

        let coinHistory = { time: Date.now(), history: result };
        history[this.state.selectedSymbol] = coinHistory;

        this.setState({ currentHistory: coinHistory.history });
    }

    private selectCoin(i) {
        this.walletMan.selectWallet(i.symbol);
        this.setState(
            { selectedSymbol: i.symbol, showSymbol: false, symbolColor: i.color, currentPrice: '' },
            () => { this.setState({ showSymbol: true }); this.refreshPrice(); this.refreshHistory(); }
        );
    }

    private toggleSending() {
        this.setState(prev => ({ expandSending: !prev.expandSending, expandReceiving: false }), () => {
            if (this.state.expandSending) {
                AnimeHelper.expandPage('#sending-page', window.innerHeight, 0);
            } else {
                AnimeHelper.expandPage('#sending-page', 0, window.innerHeight);

                anime({
                    targets: '#open-sending',
                    scale: [0, 1],
                    opacity: [0, 5],
                    duration: 200,
                    easing: 'spring(1, 80, 2, 4)',
                });
            }
        });
    }

    private toggleReceving() {
        if (this.state.expandReceiving) {
            AnimeHelper.expandPage('#receiving-page', 0, window.innerHeight,
                () => this.setState({ expandReceiving: false, expandSending: false }));
            return;
        }

        if (this.state.expandSettings) return;

        this.setState(prev => ({ expandReceiving: !prev.expandReceiving, expandSending: false }), () => {
            if (this.state.expandReceiving) {
                AnimeHelper.expandPage('#receiving-page', window.innerHeight, 0);
            }
        });
    }

    private toggleSettings() {
        if (this.state.expandSettings) {
            AnimeHelper.expandPage('#settings-page', 0, window.innerHeight, () => this.setState({ expandSettings: false }));
            return;
        }

        this.setState(prev => ({ expandSettings: !prev.expandSettings, expandReceiving: false }), () => {
            if (this.state.expandSettings) {
                AnimeHelper.expandPage('#settings-page', window.innerHeight, 0);
            }
        });
    }

    render() {
        let isDarwin = platform() === 'darwin';

        return (
            <div className={`home`}>
                <div className={`home-bar ${isDarwin ? 'titlebar-padding' : ''}`}>
                    <div className='icons'>
                        {
                            symbols.map(i => {
                                return (
                                    <div key={i.symbol} className={`icon`} onClick={e => this.selectCoin(i)}>
                                        <div className={`${this.state.selectedSymbol === i.symbol ? 'indicator' : 'indicator-none'}`} style={{ backgroundColor: i.color }} />
                                        <img src={i.img} alt={i.symbol} />
                                    </div>
                                );
                            })
                        }
                    </div>

                    <div className='icons'>
                        <div className='icon' onClick={_ => this.toggleReceving()}>
                            <img src={qrcode} />
                        </div>
                        <div className='icon' onClick={_ => this.toggleSettings()}>
                            <img src={settings} />
                        </div>
                    </div>
                </div>

                <div id='home-content' className={`home-content ${isDarwin ? 'titlebar-padding' : ''}`}>
                    <div className='chart'>
                        <AreaChart width={window.innerWidth - 68} height={200} data={this.state.currentHistory} style={{ marginLeft: -0 }}>
                            <Area dataKey='price' fill='transparent' stroke={this.state.symbolColor} />
                        </AreaChart>
                    </div>

                    <div className='price'>
                        <span className='date'>{new Date().toDateString()}</span>
                        <span className={`${this.state.currentChange > 0 ? 'rise' : 'drop'}`}>
                            {this.state.currentPrice || '---'} {`USD/${this.state.selectedSymbol}`}
                        </span>
                        <span className={`${this.state.currentChange > 0 ? 'rise' : 'drop'}`} style={{ marginLeft: 6 }}>
                            {`${this.state.currentChange}%`}
                        </span>
                    </div>

                    <div id='balanceInfo' className={`balance lato-bold ${this.state.selectedSymbol} ${this.state.stuck ? 'balance-stuck' : ''}`}>
                        <Flip bottom opposite collapse when={this.state.showSymbol} className='balanceNum'>
                            <span onClick={e => this.setState({ showBalance: !this.state.showBalance })}>
                                {
                                    this.state.showBalance ?
                                        this.walletMan ? this.walletMan.current.balance : '0'
                                        : '••••••••'
                                }
                            </span>
                        </Flip>
                        <Flip bottom opposite cascade when={this.state.showSymbol}><span className={`symbol ${this.state.selectedSymbol}`}>{this.state.selectedSymbol}</span></Flip>
                    </div>

                    {this.state.expandSending ?
                        <div id='sending-page' className='expand-area'>
                            <Send onCancel={() => this.toggleSending()} symbol={this.state.selectedSymbol} />
                        </div> :
                        <button id='open-sending' className='send' title='Send' onClick={e => this.toggleSending()}>
                            <img src={send} alt="Send" />
                        </button>
                    }

                    {
                        this.state.expandSettings ?
                            <div id='settings-page' className='expand-area'>
                                <Settings />
                            </div>
                            : undefined
                    }

                    {
                        this.state.expandReceiving ?
                            <div id='receiving-page' className='expand-area'>
                                <Receive symbol={this.state.selectedSymbol} addresses={this.walletMan.current.addresses} address={this.walletMan.current.mainAddress[0]} onCancel={() => this.toggleReceving()} />
                            </div>
                            : undefined
                    }

                    <div className='txs'>
                        {(this.walletMan ? this.walletMan.current.txs : []).map(tx => {
                            return (
                                <div className='tx' key={tx.hash}>
                                    <div className='icon'>
                                        <img src={tx.isIncome ? inIcon : outIcon} />
                                    </div>

                                    <div className='hash'>
                                        {tx.hash}
                                    </div>

                                    <div className={`amount ${tx.isIncome ? 'in' : 'out'}`}>
                                        {tx.amount}
                                    </div>

                                    <div className='date'>
                                        {new Date(tx.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        );
    }
}

export default Home;

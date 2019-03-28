import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import { Fade, Slide, Flip } from 'react-reveal';
import '../styles/Home.scss';
import { platform } from 'os';
const btc = require('../assets/btc.svg');
const eth = require('../assets/eth.svg');
const bch = require('../assets/bch.svg');
const ltc = require('../assets/ltc.svg');
const usdt = require('../assets/usdt.svg');
const settings = require('../assets/menu.svg');

const symbols = [{ img: btc, symbol: 'btc' }, { img: eth, symbol: 'eth' }, { img: bch, symbol: 'bch' }, { img: ltc, symbol: 'ltc' }, { img: usdt, symbol: 'usdt' }];

interface HomeState {
    selectedSymbol: string;
    showSymbol: boolean;
}

class Home extends React.Component<{}, HomeState> {
    state: HomeState = { selectedSymbol: 'btc', showSymbol: true };

    render() {
        let isDarwin = platform() === 'darwin';

        return (
            <div className={`home`}>
                <div className={`home-bar ${isDarwin ? 'titlebar-padding' : ''}`}>
                    <div className='icons'>
                        {
                            symbols.map(i => {
                                return (
                                    <div key={i.symbol} className={`icon ${this.state.selectedSymbol === i.symbol ? 'selected' : ''}`} onClick={e => this.setState({ selectedSymbol: i.symbol, showSymbol: false }, () => { this.setState({ showSymbol: true }) })}>
                                        <img src={i.img} alt={i.symbol} />
                                    </div>
                                );
                            })
                        }
                    </div>

                    <div className='icon'>
                        <img src={settings} />
                    </div>
                </div>

                <div className={`home-content ${isDarwin ? 'titlebar-padding' : ''}`}>
                    <div className='num lato-bold'>
                        2.67834 <Flip bottom opposite cascade when={this.state.showSymbol}><span className={`symbol ${this.state.selectedSymbol}`}>{this.state.selectedSymbol.toUpperCase()}</span></Flip>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;

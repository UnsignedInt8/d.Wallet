import * as React from 'react';
import { Flip, Fade } from 'react-reveal';
import '../styles/Home.scss';
import { platform } from 'os';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, CartesianAxis, Tooltip, Legend, Carousel } from 'recharts';

const btc = require('../assets/btc.svg');
const eth = require('../assets/eth.svg');
const bch = require('../assets/bch.svg');
const ltc = require('../assets/ltc.svg');
const usdt = require('../assets/usdt.svg');
const settings = require('../assets/menu.svg');

const symbols = [
    { img: btc, symbol: 'btc', color: '#f7931a' },
    { img: eth, symbol: 'eth', color: '#627eea' },
    { img: bch, symbol: 'bch', color: '#8dc351' },
    { img: ltc, symbol: 'ltc', color: '#bfbbbb' },
    { img: usdt, symbol: 'usdt', color: '#26a17b' }];

const btcPrice = require('../data/btc.json');

const data = [
    { name: 'Page A', uv: 1000, pv: 2400, amt: 2400, uvError: [75, 20] },
    { name: 'Page B', uv: 300, pv: 4567, amt: 2400, uvError: [90, 40] },
    { name: 'Page C', uv: 280, pv: 1398, amt: 2400, uvError: 40 },
    { name: 'Page D', uv: 200, pv: 9800, amt: 2400, uvError: 20 },
    { name: 'Page E', uv: 278, pv: null, amt: 2400, uvError: 28 },
    { name: 'Page F', uv: 189, pv: 4800, amt: 2400, uvError: [90, 20] },
    { name: 'Page G', uv: 189, pv: 4800, amt: 2400, uvError: [28, 40] },
    { name: 'Page H', uv: 189, pv: 4800, amt: 2400, uvError: 28 },
    { name: 'Page I', uv: 189, pv: 4800, amt: 2400, uvError: 28 },
    { name: 'Page J', uv: 189, pv: 4800, amt: 2400, uvError: [15, 60] },
];

interface HomeState {
    selectedSymbol: string;
    showSymbol: boolean;
    symbolColor: string;
}

class Home extends React.Component<{}, HomeState> {
    state: HomeState = { selectedSymbol: 'btc', showSymbol: true, symbolColor: symbols[0].color };

    render() {
        let isDarwin = platform() === 'darwin';

        return (
            <div className={`home`}>
                <div className={`home-bar ${isDarwin ? 'titlebar-padding' : ''}`}>
                    <div className='icons'>
                        {
                            symbols.map(i => {
                                return (
                                    <div key={i.symbol} className={`icon`} onClick={e => this.setState({ selectedSymbol: i.symbol, showSymbol: false, symbolColor: i.color }, () => { this.setState({ showSymbol: true }) })}>
                                        <div className={`${this.state.selectedSymbol === i.symbol ? 'indicator' : 'indicator-none'}`} style={{ backgroundColor: i.color }} />
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
                    <div className='chart'>
                        <AreaChart width={window.innerWidth - 68} height={200} data={btcPrice.data.history} style={{ marginLeft: -25 }}>
                            <Area dataKey='price' fill='transparent' stroke={this.state.symbolColor} />
                        </AreaChart>
                    </div>

                    <div className='price'>
                        <span className='date'>{new Date().toDateString()}</span> <span className={`rise`}>4027 {`USD/${this.state.selectedSymbol}`}</span>
                    </div>

                    <div className={`num lato-bold ${this.state.selectedSymbol}`}>
                        <Flip bottom opposite collapse when={this.state.showSymbol}><span>2.67834</span></Flip>
                        <Flip bottom opposite cascade when={this.state.showSymbol}><span className={`symbol ${this.state.selectedSymbol}`}>{this.state.selectedSymbol.toUpperCase()}</span></Flip>
                    </div>

                </div>
            </div>
        );
    }
}

export default Home;

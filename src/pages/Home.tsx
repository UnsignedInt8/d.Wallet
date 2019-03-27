import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import '../styles/Home.scss';
const btc = require('../assets/btc.svg');
const eth = require('../assets/eth.svg');
const bch = require('../assets/bch.svg');
const ltc = require('../assets/ltc.svg');
const usdt = require('../assets/usdt.svg');

class Home extends React.Component {
    render() {
        return (
            <div className='home'>
                <div className='home-bar'>
                    <div className='icon'>
                        <img src={btc} alt="" />
                    </div>
                    <div className='icon'>
                        <img src={eth} alt="" />
                    </div>
                    <div className='icon'>
                        <img src={bch} alt="" />
                    </div>
                    <div className='icon'>
                        <img src={ltc} alt="" />
                    </div>
                    <div className='icon'>
                        <img src={usdt} alt="" />
                    </div>
                </div>

                <div className='home-content'>

                </div>
            </div>
        );
    }
}

export default Home;

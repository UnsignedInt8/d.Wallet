import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import '../styles/Home.scss';
import { platform } from 'os';
const btc = require('../assets/btc.svg');
const eth = require('../assets/eth.svg');
const bch = require('../assets/bch.svg');
const ltc = require('../assets/ltc.svg');
const usdt = require('../assets/usdt.svg');
const settings = require('../assets/menu.svg');

class Home extends React.Component {

    render() {
        let isDarwin = platform() === 'darwin';

        return (
            <div className={`home`}>
                <div className={`home-bar ${isDarwin ? 'titlebar-padding' : ''}`}>
                    <div className='icons'>
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

                    <div className='icon'>
                        <img src={settings} />
                    </div>
                </div>

                <div className='home-content'>

                </div>
            </div>
        );
    }
}

export default Home;

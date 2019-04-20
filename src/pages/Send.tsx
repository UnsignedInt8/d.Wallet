import * as React from 'react';
import '../styles/Send.scss';
import anime from 'animejs';
import { getLang } from '../i18n';
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';
import { Validation, Password } from '../components';
import { Flip, Fade } from 'react-reveal';

const crypto = require('crypto');

interface PageProps {
    symbol: string;
    onCancel: () => void;
}

interface PageState {
    toNums: number;
    prepareToSend?: boolean;
    validatingPassword?: boolean;
    validPassword?: boolean;
}

const cancelWhite = require('../assets/cancel-white.svg');
const cancelIcon = require('../assets/cancel.svg');
const sendIcon = require('../assets/send2.svg');
const calc = require('../assets/calculator.svg');
const pen = require('../assets/chat.svg');
const mining = require('../assets/mining.svg');

const coinProps = {
    default: { feeUnit: 'Sat/B', maxTo: 10, desc: 'Satoshi/Byte', unit: 'Satoshis', },
    eth: { feeUnit: 'Gwei', maxTo: 1, desc: 'Gwei', unit: 'Gwei', },
    usdt: { feeUnit: 'Sat/B', maxTo: 1, desc: 'Satoshi/Byte', unit: 'Satoshis' },
}

export default class Send extends React.Component<PageProps, PageState>{

    state: PageState = { toNums: 1, prepareToSend: true, };
    appSettings = getAppSettings(PassMan.password);
    i18n = getLang(this.appSettings.lang);

    private addReceiver() {
        let coin = coinProps[this.props.symbol] || coinProps.default;
        this.setState({ toNums: Math.min(this.state.toNums + 1, coin.maxTo) });
    }

    private removeReceiver() {
        this.setState({ toNums: Math.max(this.state.toNums - 1, 1) });
    }

    private jumpToPassword() {
        anime({
            targets: '#payment-content, #payment-actions',
            translateX: [0, -window.innerWidth],
            opacity: 0,
            duration: 600,
            easing: 'linear',
        });

        anime({
            targets: '#payment-validation',
            translateX: [-window.innerWidth, 0],
            duration: 600,
            easing: 'linear',
            complete: () => this.setState({ validatingPassword: true }),
        });

        this.setState({ validatingPassword: false });
    }

    private onPasswordChange(value: string) {
        if (!PassMan.verify(value)) return;
        this.setState({ validPassword: true });
    }

    render() {

        let coin = coinProps[this.props.symbol] || coinProps.default;

        return (
            <div className='sending'>
                <div className='compose-area'>
                    {new Array(Math.min(this.state.toNums, coin.maxTo)).fill(Date.now()).map((v, i) => {
                        return (
                            <div key={i} className='compose'>
                                <input type="text" placeholder={`${this.props.symbol.toUpperCase()} Address`} />
                                <input type="number" placeholder='Amount' max={100_000_000} min={0.0000001} />
                                <input className='message-input' type="text" placeholder='Message' maxLength={140} />

                                <img className='send' src={sendIcon} />
                                <img className='calc' src={calc} />
                                <img className='pen' src={pen} />
                            </div>
                        );
                    })}

                    <div className='mining'>
                        <input className='mining' type="number" defaultValue={'3'} max={100_000_000} min={1} placeholder={`${this.props.symbol.toUpperCase()} Fees`} />
                        <img className='mining' src={mining} />
                        <span title={`${coin.desc}`}>{`${coin.feeUnit}`}</span>
                    </div>

                    <div className='plus-container'>
                        {
                            this.state.toNums > 1 && coin.maxTo > 1 ?
                                <button className='plus' onClick={_ => this.removeReceiver()}>
                                    <span>-</span>
                                </button>
                                : undefined
                        }
                        {
                            this.state.toNums < coin.maxTo ?
                                <button className='plus' onClick={_ => this.addReceiver()}>
                                    <span>+</span>
                                </button>
                                : undefined
                        }
                    </div>

                </div>

                <div className='buttons'>
                    <button className='cancel' onClick={e => this.props.onCancel()}>{this.i18n.buttons.cancel}</button>
                    <button className='confirm'>{this.i18n.buttons.ok}</button>
                </div>


                {this.state.prepareToSend ?
                    <div id='payment-shadow'></div>
                    : undefined
                }

                {this.state.prepareToSend ?
                    <div id='payment-details' className={this.state.validatingPassword ? 'validatingPassword' : undefined}>
                        <div id='payment-title'>
                            <Flip bottom opposite cascade when={this.state.validatingPassword}>{this.state.validatingPassword ? 'Validate Password' : 'Transaction Details'}</Flip>
                        </div>

                        <img id='close-payment' src={this.state.validatingPassword ? cancelWhite : cancelIcon} />

                        <div id='payment-content'>

                            <div className='payment-details-item'>
                                <div className='title amount-title'>
                                    Amount:
                                </div>
                                <div className='content amount'>
                                    1.2323 <span className='symbol'>{this.props.symbol}</span>
                                </div>
                            </div>

                            <div className='payment-details-item'>
                                <div className='title'>
                                    From:
                                </div>
                                <div className='content'>
                                    {
                                        new Array(4).fill(0).map((v, i) => {
                                            return (
                                                <div key={i} >
                                                    {'0x' + crypto.randomBytes(16).toString('hex')}
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>

                            <div className='payment-details-item'>
                                <div className='title'>
                                    To:
                                </div>
                                <div className='content'>
                                    {
                                        new Array(4).fill(0).map((v, i) => {
                                            return (
                                                <div key={i} className='toInfo'>
                                                    <div className='to'>{'0x' + crypto.randomBytes(16).toString('hex')}</div>
                                                    <div className='amount'>{Math.random()}</div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>

                            <div className='payment-details-item'>
                                <div className='title'>
                                    Message:
                                </div>
                                <div className='content'>
                                    Hello World
                                </div>
                            </div>

                            <div className='payment-details-item'>
                                <div className='title'>
                                    Fee:
                                </div>
                                <div className='content'>
                                    {Math.random() * 100000000} <span>{coin.unit}</span>
                                </div>
                            </div>

                        </div>

                        <div id='payment-validation'>
                            {this.state.validPassword ? <Validation id='validation' /> : undefined}
                            <Password onChange={v => this.onPasswordChange(v)} />
                        </div>

                        <div id='payment-actions'>
                            <button onClick={_ => this.jumpToPassword()}>{this.i18n.buttons.next}</button>
                        </div>
                    </div>
                    : undefined
                }
            </div>
        );
    }
}
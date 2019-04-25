import * as React from 'react';
import '../styles/Send.scss';
import anime from 'animejs';
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';
import { Validation, Password } from '../components';
import { Flip, Fade } from 'react-reveal';
import AnimeHelper from '../lib/AnimeHelper';
import * as jquery from 'jquery';
import { getWalletMan } from '../wallet/WalletManager';
import sleep from 'sleep-promise';
import PaymentDetails from './PaymentDetails';
import Application from '../Application';
import { GenTxInfo } from '../wallet/Wallet';

interface PageProps {
    symbol: string;
    onCancel: () => void;
}

interface PageState {
    toNums: number;
    prepareToSend?: boolean;
    validatingPassword?: boolean;
    validPassword?: boolean;
    isBuildingTx?: boolean;

    txInfo?: GenTxInfo;
}

const sendIcon = require('../assets/send2.svg');
const calc = require('../assets/calculator.svg');
const pen = require('../assets/chat.svg');
const mining = require('../assets/mining.svg');
const write = require('../assets/write.svg');

const coinProps = {
    default: { feeUnit: 'Sat/B', maxTo: 10, desc: 'Satoshis/Byte', unit: 'Satoshis', },
    eth: { feeUnit: 'Gwei', maxTo: 1, desc: 'Gwei', unit: 'Gwei', },
    usdt: { feeUnit: 'Sat/B', maxTo: 1, desc: 'Satoshis/Byte', unit: 'Satoshis' },
}

export default class Send extends React.Component<PageProps, PageState>{

    state: PageState = { toNums: 1, prepareToSend: false, isBuildingTx: false };
    appSettings = getAppSettings(PassMan.password);
    i18n = this.appSettings.i18n;
    walletMan = getWalletMan(this.appSettings.mnemonic);
    private paymentDetails: PaymentDetails | null = null;

    get shouldLockSymbol() { return this.state.toNums > 1 };

    private addReceiver() {
        let coin = coinProps[this.props.symbol] || coinProps.default;
        this.setState({ toNums: Math.min(this.state.toNums + 1, coin.maxTo) });
    }

    private removeReceiver() {
        this.setState({ toNums: Math.max(this.state.toNums - 1, 1) });
    }

    private async buildTx() {
        let addresses = jquery('.input-address').map((i, el) => jquery(el).val()).get() as string[];
        let amounts = jquery('.input-amount').map((i, el) => Number.parseFloat(jquery(el).val()) || 0).get() as number[];
        let wallet = this.walletMan.wallets[this.props.symbol];

        let to = addresses.zip(amounts).select(i => { return { address: i[0], amount: i[1] } }).where(i => i.address.length > 0).toArray();
        if (to.length === 0) return;

        if (to.some(v => !wallet.isValidAddress(v.address))) {
            Application.addNotification({ title: '', message: this.i18n.messages.invalidAddress, type: 'warning' });
            return;
        }

        let message: string = jquery('#message-input').val() || jquery('#eth-message').val();
        let fee = Number.parseInt(jquery('#mining').val());

        this.setState({ isBuildingTx: true, });
        let tx = await wallet.genTx({ to, message, gasPrice: fee, satoshiPerByte: fee });

        if (!tx) {
            Application.addNotification({ title: '', message: this.i18n.messages.noInternet, type: 'warning' });
            this.setState({ isBuildingTx: false });
            return;
        }

        console.log(tx);
        this.setState({ isBuildingTx: false, prepareToSend: true, txInfo: tx }, () => {
            this.paymentDetails!.open();
        });
    }

    private onAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
        let amount = Number.parseFloat(e.target.value);
        if (amount > 2100_000_000 || amount < 0) {
            e.target.value = '0';
        }
    }

    private onPasswordVerified() {
        setTimeout(async () => {
            let txInfo = this.state.txInfo!;
            let id = await this.walletMan.current.broadcastTx(txInfo.hex);
            if (txInfo.id === id) {
                Application.addNotification({ title: '', message: `${this.i18n.messages.broadcastTx(id)}`, type: 'success' });
            } else {
                Application.addNotification({ title: '', message: `${this.i18n.messages.broadcastFailed}`, type: 'warning' });
            }

            this.paymentDetails!.close();
            await sleep(1500);
            this.props.onCancel();
        }, 1500);
    }

    private onAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
        const className = 'invalid-data';
        let wallet = this.walletMan.current;
        if (wallet.isValidAddress(e.target.value)) {
            e.target.classList.remove(className);
        } else {
            if (!e.target.classList.contains(className)) e.target.classList.add(className);
        }
    }

    render() {

        let coin = coinProps[this.props.symbol] || coinProps.default;

        return (
            <div className='sending'>
                <div className='compose-area'>
                    {new Array(Math.min(this.state.toNums, coin.maxTo)).fill(Date.now()).map((v, i) => {
                        return (
                            <div key={i} className='compose'>
                                <input className='input-address' type="text" placeholder={`${this.props.symbol.toUpperCase()} ${this.i18n.sending.address}`} onChange={e => this.onAddressChange(e)} />
                                <input className={`input-amount ${this.state.toNums > 1 && coin.maxTo > 1 ? 'input_bottom_border' : undefined}`} type="number" placeholder={this.i18n.sending.amount} max={100_000_000} min={0} onChange={e => this.onAmountChange(e)} />

                                <img className='send' src={sendIcon} />
                                <img className='calc' src={calc} />
                            </div>
                        );
                    })}

                    <div className='message'>
                        {this.props.symbol === 'eth' ?
                            <div style={{ display: 'grid' }}>
                                <textarea id="eth-message" rows={10} maxLength={20 * 1024} placeholder={this.i18n.sending.message}></textarea>
                                <img id='write' src={write} />
                            </div> :
                            <div style={{ display: 'grid' }}>
                                <input id='message-input' className='message-input' type="text" placeholder={this.i18n.sending.message} maxLength={140} />
                                <img className='pen' src={pen} />
                            </div>
                        }
                    </div>

                    <div className='mining'>
                        <input id='mining' className='mining' type="number" defaultValue={'3'} max={100_000_000} min={1} placeholder={`${this.props.symbol.toUpperCase()} ${this.i18n.sending.fees}`} onChange={e => this.onAmountChange(e)} />
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
                    <button className='confirm' onClick={e => this.buildTx()}>{this.i18n.buttons.ok}</button>
                </div>


                {(this.state.prepareToSend || this.state.isBuildingTx) ?
                    <div id='payment-shadow'>
                        {this.state.isBuildingTx ?
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Building, wait a moment please...</div>
                            : undefined
                        }
                    </div>
                    : undefined
                }

                {this.state.prepareToSend && this.state.txInfo ?
                    <PaymentDetails ref={e => this.paymentDetails = e} coinUnit={this.props.symbol} symbol={this.props.symbol} txInfo={this.state.txInfo} onClose={() => this.setState({ prepareToSend: false })} onVerified={() => this.onPasswordVerified()} />
                    : undefined
                }
            </div>
        );
    }
}
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
import { GenTxInfo, TxInfo } from '../wallet/Wallet';
import UIHelper from '../lib/UIHelper';
import { Application } from '../Application';
import QRScanner, { QResult } from './QRScanner';

interface PageProps {
    symbol: string;
    onCancel: () => void;
    style?: React.CSSProperties;
}

interface PageState {
    toNums: number;
    prepareToSend?: boolean;
    validatingPassword?: boolean;
    validPassword?: boolean;
    isBuildingTx?: boolean;

    txInfo?: GenTxInfo;
    expandPage?: 'qrscanner';
}

const sendIcon = require('../assets/send2.svg');
const calc = require('../assets/calculator.svg');
const pen = require('../assets/chat.svg');
const mining = require('../assets/mining.svg');
const write = require('../assets/write.svg');
const minus = require('../assets/minus.svg');
const plus = require('../assets/plus.svg');
const scan = require('../assets/scan.svg');

const coinProps = {
    default: { feeUnit: 'Sat/B', maxTo: 10, desc: 'Satoshis/Byte', unit: 'Satoshis', },
    eth: { feeUnit: 'Gwei', maxTo: 1, desc: 'Gwei', unit: 'Gwei', },
    usdt: { feeUnit: 'Sat/B', maxTo: 1, desc: 'Satoshis/Byte', unit: 'Satoshis' },
}

export default class Send extends React.Component<PageProps, PageState>{

    state: PageState = { toNums: 1, prepareToSend: false, isBuildingTx: false };
    private appSettings = getAppSettings(PassMan.password);
    private i18n = this.appSettings.i18n;
    private walletMan = getWalletMan(this.appSettings.mnemonic);
    private paymentDetails: PaymentDetails | null = null;
    private qrIndex?: number;

    get shouldLockSymbol() { return (jquery('.input-address').map((i, el) => jquery(el).val()).get() as string[]).filter(a => a.length > 0).length > 0 };

    componentDidMount() {
        jquery('.input-address').focus();
    }

    private addReceiver() {
        let coin = coinProps[this.props.symbol] || coinProps.default;
        this.setState({ toNums: Math.min(this.state.toNums + 1, coin.maxTo) });
    }

    private removeReceiver() {
        this.setState({ toNums: Math.max(this.state.toNums - 1, 1) });
    }

    private async buildTx() {

        let addresses = jquery('.input-address').map((i, el) => jquery(el).val()).get() as string[];
        let amounts = jquery('.input-amount').map((i, el) => Math.max(Number.parseFloat(jquery(el).val()), 0.000001) || 0).get() as number[];
        let wallet = this.walletMan.wallets[this.props.symbol];

        let to = addresses.zip(amounts).select(i => { return { address: i[0], amount: i[1] } }).where(i => i.address.length > 0).toArray();
        if (to.length === 0) return;

        if (wallet.balance <= 0) {
            Application.notify({ message: this.i18n.messages.checkBalance, appearance: 'error' });
            return;
        }

        if (to.some(v => !wallet.isValidAddress(v.address))) {
            Application.notify({ message: this.i18n.messages.invalidAddress, appearance: 'error', });
            return;
        }

        let message: string = jquery('#message-input').val() || jquery('#eth-message').val();
        let fee = Number.parseInt(jquery('#mining').val());

        this.setState({ isBuildingTx: true, });
        let tx = await wallet.genTx({ to, message, gasPrice: fee, satoshiPerByte: fee });

        if (!tx) {
            Application.notify({ message: this.i18n.messages.noInternet, appearance: 'error', });
            this.setState({ isBuildingTx: false });
            return;
        }

        // console.log(tx);
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
            let id: string;
            try {
                id = await this.walletMan.current.broadcastTx(txInfo.hex);
            } catch (error) {
                Application.notify({ message: this.i18n.messages.broadcastFailed, appearance: 'error' });
                return;
            }

            let txid = `${txInfo.id.substring(0, 7)}...${txInfo.id.substring(txInfo.id.length - 7)}`
            if (txInfo.id === id) {
                Application.notify({ message: `${this.i18n.messages.broadcastTx(txid)}`, appearance: 'success', });
            } else {
                Application.notify({ message: `${this.i18n.messages.broadcastFailed}`, appearance: 'error', });
            }

            this.paymentDetails!.close();
            await sleep(1500);
            this.props.onCancel();

            let tx: TxInfo = {
                amount: txInfo.value,
                blockHash: '',
                blockHeight: Number.NaN,
                fee: txInfo.fee,
                hash: txInfo.id,
                isPending: true,
                timestamp: Date.now(),
                isIncome: false,
                inputs: txInfo.from.map(f => { return { address: [f], value: 0 } }),
                outputs: txInfo.to.map(t => { return { address: [t.address], value: t.amount } }),
            };

            this.walletMan.current.txs.unshift(tx);
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

    private onBalanceClick() {
        let balance = this.walletMan.current.balance;
        jquery('.input-amount').first().val(balance);
    }

    private expandPage(page: 'qrscanner') {
        this.setState({ expandPage: page }, () => {
            AnimeHelper.expandPage('#sending-expanding-page', 12, 0, undefined, 'linear');
        });
    }

    private closePage() {
        AnimeHelper.expandPage('#sending-expanding-page', 0, window.innerHeight, () => this.setState({ expandPage: undefined }), 'linear');
    }

    private onQRCode(data: QResult) {
        if (!data || this.qrIndex === undefined) return;
        jquery('.input-address').eq(this.qrIndex || 0).val(data.address);
        jquery('.input-amount').eq(this.qrIndex || 0).val(data.query ? (data.query.amount || 0) : 0);
        this.qrIndex = undefined;
        this.closePage();
    }

    private onQRError(err: any) {
        Application.notify({ message: this.i18n.messages.cameraNotAvailable, appearance: 'error' });
        if (this.state.expandPage === 'qrscanner') this.closePage();
    }

    render() {

        let coin = coinProps[this.props.symbol] || coinProps.default;

        return (
            <div className={`sending ${UIHelper.isDarwin ? '' : 'no-drag'}`} style={this.props.style}>
                <div className={`compose-area ${UIHelper.scrollBarClassName}`}>
                    {new Array(Math.min(this.state.toNums, coin.maxTo)).fill(Date.now()).map((v, i) => {
                        return (
                            <div key={i} className='compose no-drag'>
                                <input className='input-address' type="text" placeholder={`${this.props.symbol.toUpperCase()} ${this.i18n.sending.address}`} onChange={e => this.onAddressChange(e)} />
                                <input className={`input-amount ${this.state.toNums > 1 && coin.maxTo > 1 ? 'input_bottom_border' : undefined}`} type="number" placeholder={this.i18n.sending.amount} max={100_000_000} min={0} onChange={e => this.onAmountChange(e)} />

                                <img className='send' src={sendIcon} />
                                <img className='calc' src={calc} />
                                <img className='scan' src={scan} onClick={e => { this.expandPage('qrscanner'); this.qrIndex = i }} />
                            </div>
                        );
                    })}

                    <div id='balance' className='no-drag' onClick={_ => this.onBalanceClick()}>
                        {this.i18n.sending.balance}: {this.walletMan.current.balance} <span>{this.props.symbol}</span>
                    </div>

                    <div className='message no-drag'>
                        {this.props.symbol === 'eth' ?
                            <div className='no-drag' style={{ display: 'grid' }}>
                                <textarea id="eth-message" className='no-drag' rows={10} maxLength={20 * 1024} placeholder={this.i18n.sending.message}></textarea>
                                <img id='write' src={write} />
                            </div> :
                            <div className='no-drag' style={{ display: 'grid' }}>
                                <input id='message-input' className='message-input no-drag' type="text" placeholder={this.i18n.sending.message} maxLength={140} />
                                <img className='pen' src={pen} />
                            </div>
                        }
                    </div>

                    <div className='mining nodrag'>
                        <input id='mining' className='mining' type="number" defaultValue={'3'} max={100_000_000} min={1} placeholder={`${this.props.symbol.toUpperCase()} ${this.i18n.sending.fees}`} onChange={e => this.onAmountChange(e)} />
                        <img className='mining' src={mining} />
                        <span title={`${coin.desc}`}>{`${coin.feeUnit}`}</span>
                    </div>

                    <div className='plus-container no-drag'>
                        {
                            this.state.toNums > 1 && coin.maxTo > 1 ?
                                <button className='plus' onClick={_ => this.removeReceiver()}>
                                    <img src={minus} />
                                </button>
                                : undefined
                        }
                        {
                            this.state.toNums < coin.maxTo ?
                                <button className='plus' onClick={_ => this.addReceiver()}>
                                    <img src={plus} />
                                </button>
                                : undefined
                        }
                    </div>

                </div>

                <div className='buttons no-drag'>
                    <button className='cancel' onClick={e => this.props.onCancel()}>{this.i18n.buttons.cancel}</button>
                    <button className='confirm' onClick={e => this.buildTx()}>{this.i18n.buttons.ok}</button>
                </div>


                {(this.state.prepareToSend || this.state.isBuildingTx) ?
                    <div id='payment-shadow'>
                        {this.state.isBuildingTx ?
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{this.i18n.sending.building}</div>
                            : undefined
                        }
                    </div>
                    : undefined
                }

                {this.state.prepareToSend && this.state.txInfo ?
                    <PaymentDetails ref={e => this.paymentDetails = e} coinUnit={this.props.symbol} symbol={this.props.symbol} txInfo={this.state.txInfo} onClose={() => this.setState({ prepareToSend: false })} onVerified={() => this.onPasswordVerified()} />
                    : undefined
                }

                {this.state.expandPage ?
                    <div id='sending-expanding-page'>
                        {this.state.expandPage === 'qrscanner' ? <QRScanner onResult={r => this.onQRCode(r)} onCancel={() => this.closePage()} onError={e => this.onQRError(e)} /> : undefined}
                    </div>
                    : undefined}

            </div>
        );
    }
}

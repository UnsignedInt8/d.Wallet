import * as React from 'react';
import '../styles/Transaction.scss';
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';
import * as QRCode from 'qrcode.react';
import { TxInfo } from '../wallet/Wallet';
const { shell } = require('electron');

const blockchair = require('../assets/blockchair_light.png');
interface Props {
    txInfo: TxInfo;
    symbol?: string;
    onCacnel: () => void;
}

const chains = {
    'btc': 'bitcoin',
    'bch': 'bitcoin-cash',
    'eth': 'ethereum',
    'ltc': 'litecoin',
    'usdt': 'bitcoin',
}

export default class Transaction extends React.Component<Props, any> {

    appSettings = getAppSettings(PassMan.password);
    i18n = this.appSettings.i18n;

    private openLink(target: string) {
        shell.openExternal(target);
    }

    render() {
        return (
            <div id='transaction'>
                <div id='transaction-details'>
                    <div id='transaction-details-head'>
                        <div id='transaction-details-title' className='questrial'>
                            {this.i18n.txDetails.title}
                        </div>

                        <div id='transaction-details-qrcode'>
                            <QRCode value={`https://blockchair.com/${chains[this.props.symbol!]}/transaction/${this.props.txInfo.hash}`} level='M' bgColor='transparent' fgColor='white' size={79} />
                        </div>

                        <div id='transaction-details-head-content'>
                            <div className='detail-item'>
                                <div className='detail-item-label'>
                                    {this.i18n.txDetails.hash}:
                                </div>
                                <div className='detail-item-content' title={this.props.txInfo.hash}>
                                    {this.props.txInfo.hash}
                                </div>
                            </div>

                            <div className='detail-item'>
                                <div className='detail-item-label'>
                                    {this.i18n.txDetails.time}:
                                </div>
                                <div className='detail-item-content'>
                                    {new Date(this.props.txInfo.timestamp).toLocaleString()}
                                </div>
                            </div>

                            <div className='detail-item'>
                                <div className='detail-item-label'>
                                    {this.i18n.txDetails.height}:
                                </div>
                                <div className='detail-item-content'>
                                    {this.props.txInfo.blockHeight}
                                </div>
                            </div>
                        </div>

                    </div>

                    <div id='transaction-details-content'>
                        <div className='detail-item'>
                            <div className='transaction-item-label'>
                                {this.i18n.txDetails.from}:
                            </div>
                            <div className='transaction-item-content'>
                                {this.props.txInfo.inputs.map(v => {
                                    return (
                                        <div title={v.address[0]}>{v.address[0]}</div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='detail-item'>
                            <div className='transaction-item-label'>
                                {this.i18n.txDetails.to}:
                            </div>
                            <div className='transaction-item-content'>
                                {this.props.txInfo.outputs.map(v => {
                                    return (
                                        <div title={v.address[0]}>{v.address[0]}</div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='detail-item'>
                            <div className='transaction-item-label'>
                                {this.i18n.txDetails.amount}:
                            </div>
                            <div className='transaction-item-content amount'>
                                {`${this.props.txInfo.amount} ${this.props.symbol}`}
                            </div>
                        </div>
                        <div className='detail-item'>
                            <div className='transaction-item-label'>
                                {this.i18n.txDetails.fee}:
                            </div>
                            <div className='transaction-item-content amount'>
                                {`${this.props.txInfo.fee || '---'} ${this.props.symbol}`}
                            </div>
                        </div>

                        <div id='blockchair_logo'>
                            <img src={blockchair} onClick={e => this.openLink(`https://blockchair.com/${chains[this.props.symbol!]}/transaction/${this.props.txInfo.hash}`)} />
                        </div>
                    </div>
                </div>

                <div id='tx-buttons'>
                    <button id='close' onClick={e => this.props.onCacnel()}>
                        {this.i18n.buttons.close}
                    </button>
                </div>
            </div>
        );
    }
}
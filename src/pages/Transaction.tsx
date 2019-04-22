import * as React from 'react';
import '../styles/Transaction.scss';
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';
import * as QRCode from 'qrcode.react';
import { TxInfo } from '../wallet/Wallet';

const blockchair = require('../assets/blockchair_light.png');
interface Props {
    txInfo: TxInfo;
    onCacnel: () => void;
}

export default class Transaction extends React.Component<Props, any> {

    appSettings = getAppSettings(PassMan.password);
    i18n = this.appSettings.i18n;

    render() {
        return (
            <div id='transaction'>
                <div id='transaction-details'>
                    <div id='transaction-details-head'>
                        <div id='transaction-details-title' className='questrial'>
                            {this.i18n.txDetails.title}
                        </div>

                        <div id='transaction-details-qrcode'>
                            <QRCode value={'0xf3d66e021032a18635e6a946a21f2317ca4e8fc1810f169dc282ff4c199bef4c'} level='M' bgColor='transparent' fgColor='white' size={108} />
                        </div>

                        <div id='transaction-details-head-content'>
                            <div className='detail-item'>
                                <div className='detail-item-label'>
                                    {this.i18n.txDetails.hash}:
                                </div>
                                <div className='detail-item-content'>
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
                                From:
                            </div>
                            <div className='transaction-item-content'>
                                <div>12cgpFdJViXbwHbhrA3TuW1EGnL25Zqc3P</div>
                                {/* <div>3PbJsixkjmjzsjCpi4xAYxxaL5NnxrbF9B</div> */}
                            </div>
                        </div>
                        <div className='detail-item'>
                            <div className='transaction-item-label'>
                                To:
                            </div>
                            <div className='transaction-item-content'>
                                <div>3PbJsixkjmjzsjCpi4xAYxxaL5NnxrbF9B</div>
                            </div>
                        </div>
                        <div className='detail-item'>
                            <div className='transaction-item-label'>
                                Amount:
                            </div>
                            <div className='transaction-item-content'>
                                2.3 BTC
                            </div>
                        </div>
                        <div className='detail-item'>
                            <div className='transaction-item-label'>
                                {this.i18n.txDetails.fee}:
                            </div>
                            <div className='transaction-item-content'>
                                0.00104520 BTC
                            </div>
                        </div>

                        <div id='blockchair_logo'>
                            <img src={blockchair} />
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
import * as React from 'react';
import '../styles/Transaction.scss';
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';
import * as QRCode from 'qrcode.react';
import { TxInfo } from '../wallet/Wallet';

interface Props {
    txInfo?: TxInfo;
}

export default class Transaction extends React.Component<Props, any> {

    appSettings = getAppSettings(PassMan.password);
    i18n = this.appSettings.i18n;

    render() {
        return (
            <div id='transaction'>
                <div id='transaction-details'>
                    <div id='transaction-details-head'>
                        <div id='transaction-details-title'>
                            Transaction Details
                        </div>

                        <div id='transaction-details-qrcode'>
                            <QRCode value={'0xf3d66e021032a18635e6a946a21f2317ca4e8fc1810f169dc282ff4c199bef4c'} level='M' bgColor='transparent' fgColor='white' size={108} />
                        </div>

                        <div id='transaction-details-head-content'>
                            <div className='detail-item'>
                                <div className='detail-item-label'>
                                    Hash:
                                </div>
                                <div className='detail-item-content'>
                                    8f78a66138f45582a08d3363507a8695cef49bc472b45bd531d61f992d71038d
                                </div>
                            </div>

                            <div className='detail-item'>
                                <div className='detail-item-label'>
                                    Time:
                                </div>
                                <div className='detail-item-content'>
                                    {`${new Date().toLocaleDateString()}`}
                                </div>
                            </div>

                            <div className='detail-item'>
                                <div className='detail-item-label'>
                                    Height:
                                </div>
                                <div className='detail-item-content'>
                                    573206
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <div id='tx-buttons'>
                    <button id='close'>
                        {this.i18n.buttons.close}
                    </button>
                </div>
            </div>
        );
    }
}
import * as React from 'react';
import * as QRCode from 'qrcode.react';
import '../styles/Receive.scss';

const qrcode = require('../assets/qrcode.svg');

interface Props {
    address: string;
    symbol: string;
    onCancel: () => void;
}

export default class Receive extends React.Component<Props, {}>{

    render() {
        return (
            <div id='receiving' className='lato-bold' onClick={_ => this.props.onCancel()}>
                <div id='info'>
                    Your {this.props.symbol.toUpperCase()} address and QR Code:
                    <div>
                        {this.props.address}
                    </div>
                </div>
                <div id='qrcode'>
                    <div id='qrcode-container'>
                        <div id='title'>
                            Bitcoin Address
                        </div>
                        <QRCode value={this.props.address} level='Q' bgColor='transparent' fgColor='white' />
                    </div>
                </div>
            </div>
        );
    }
}
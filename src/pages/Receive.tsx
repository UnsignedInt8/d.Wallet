import * as React from 'react';
import * as QRCode from 'qrcode.react';
import '../styles/Receive.scss';

interface Props {
    address: string;
    symbol: string;
    onCancel: () => void;
}

const coins = {
    'btc': 'Bitcoin',
    'eth': 'Ethereum',
    'bch': 'Bitcoin Cash',
    'ltc': 'Litecoin',
    'usdt': 'USDT'
}

export default class Receive extends React.Component<Props, {}>{

    render() {
        const value = `${coins[this.props.symbol].toLowerCase()}:${this.props.address}`;
        
        return (
            <div id='receiving' className='lato-bold' >
                <div id='info'>
                    Your {this.props.symbol.toUpperCase()} address and QR Code:
                    <div>
                        {this.props.address}
                    </div>
                </div>
                <div id='qrcode'>
                    <div id='qrcode-container'>
                        <div id='title'>
                            {coins[this.props.symbol]} Address
                        </div>
                        <QRCode value={value} level='Q' bgColor='transparent' fgColor='white' />
                    </div>
                </div>
            </div>
        );
    }
}
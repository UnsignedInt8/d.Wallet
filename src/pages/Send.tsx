import * as React from 'react';
import '../styles/Send.scss';
import anime from 'animejs';

interface PageProps {
    symbol: string;
    onCancel: () => void;
}

interface PageState {
    toNums: number;
}

const sendIcon = require('../assets/send2.svg');
const calc = require('../assets/calculator.svg');
const pen = require('../assets/chat.svg');
const mining = require('../assets/mining.svg');

const coinProps = {
    default: { feeUnit: 'Sat/B', maxTo: 10, desc: 'Satoshi/Byte' },
    eth: { feeUnit: 'Gwei', maxTo: 1, desc: 'Gwei' },
    usdt: { feeUnit: 'Sat/B', maxTo: 1, desc: 'Satoshi/Byte' },
}

export default class Send extends React.Component<PageProps, PageState>{

    state: PageState = { toNums: 1 };

    private addReceiver() {
        let coin = coinProps[this.props.symbol] || coinProps.default;
        this.setState({ toNums: Math.min(this.state.toNums + 1, coin.maxTo) });
    }

    private removeReceiver() {
        this.setState({ toNums: Math.max(this.state.toNums - 1, 1) });
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
                                <input type="number" placeholder='Amount' />
                                <input className='message-input' type="text" placeholder='Message' maxLength={140} />

                                <img className='send' src={sendIcon} />
                                <img className='calc' src={calc} />
                                <img className='pen' src={pen} />
                            </div>
                        );
                    })}

                    <div className='mining'>
                        <input className='mining' type="number" defaultValue={'3'} placeholder={`${this.props.symbol.toUpperCase()} Fees`} />
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
                    <button className='cancel' onClick={e => this.props.onCancel()}>Cancel</button>
                    <button className='confirm'>Send</button>
                </div>
            </div>
        );
    }
}
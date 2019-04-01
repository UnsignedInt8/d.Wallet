import * as React from 'react';
import '../styles/Send.scss';
import anime from 'animejs';

interface PageProps {
    onCancel: () => void;
}

interface PageState {
    toNums: number;
}

const sendIcon = require('../assets/send2.svg');
const calc = require('../assets/calculator.svg');
const pen = require('../assets/chat.svg');

export default class Send extends React.Component<PageProps, PageState>{

    state: PageState = { toNums: 1 };

    private onCancel() {
        anime({
            targets: '#sending-page',
            translateY: window.innerHeight,
            easing: 'easeOutQuint',
            duration: 600,

            complete: () => this.props.onCancel(),
        });
    }

    render() {
        return (
            <div className='sending'>
                <div className='compose-area'>
                    {new Array(this.state.toNums).fill(Date.now()).map((v, i) => {
                        return (
                            <div key={i} className='compose'>
                                <input type="text" placeholder='Address' />
                                <input type="number" placeholder='Amount' />
                                <input type="text" placeholder='Message' />

                                <img className='send' src={sendIcon} />
                                <img className='calc' src={calc} />
                                <img className='pen' src={pen} />
                            </div>
                        );
                    })}
                </div>

                <div className='buttons'>
                    <button className='cancel' onClick={e => this.onCancel()}>Cancel</button>
                    <button className='confirm'>Send</button>
                </div>
            </div>
        );
    }
}
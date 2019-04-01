import * as React from 'react';
import '../styles/Send.scss';

interface PageState {
    toNums: number;
}

const sendIcon = require('../assets/send2.svg');
const calc = require('../assets/calculator.svg');
const pen = require('../assets/chat.svg');

export default class Send extends React.Component<{}, PageState>{

    state: PageState = { toNums: 1 };

    render() {
        return (
            <div className='sending'>
                <div className='compose-area'>
                    {new Array(this.state.toNums).fill(Date.now()).map((v, i) => {
                        return (
                            <div key={i} className='compose'>
                                <input type="text" />
                                <input type="number" />
                                <input type="text" />
                                <input type="text" />

                                <img className='send' src={sendIcon} />
                                <img className='calc' src={calc} />
                                <img className='pen' src={pen} />
                            </div>
                        );
                    })}
                </div>

                <div className='buttons'>
                    <button className='cancel'>Cancel</button>
                    <button className='confirm'>Send</button>
                </div>
            </div>
        );
    }
}
import * as React from 'react';
import '../styles/Send.scss';

interface PageState {
    toNums: number;
}

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
                                <input type="text" />
                                <input type="text" />
                                <input type="text" />
                            </div>
                        );
                    })}
                </div>

                <div className='buttons'>
                </div>
            </div>
        );
    }
}
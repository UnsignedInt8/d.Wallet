import * as React from 'react';
import '../styles/LockScreen.scss';
import * as Clock from 'react-live-clock';
import { getLang } from '../i18n';
import * as jquery from 'jquery';

const lock = require('../assets/padlock.svg');
const i18n = getLang();

interface State {
    validated: boolean;
}

export default class LockScreen extends React.Component<{}, State> {

    state: State = { validated: false }

    componentDidMount() {
        jquery('input').focus();
    }

    render() {
        return (
            <div id='lock-screen'>
                <div id='clock'><Clock className='clock questrial' format={'HH:mm:ss'} ticking={true} /></div>
                <div id='security'>
                    {
                        this.state.validated ?
                            <div style={{ width: 52, height: 52 }}>
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                                    <circle className="path circle" fill="none" stroke="#fff" strokeWidth="5" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                                    <polyline className="path check" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
                                </svg>
                            </div> : undefined
                    }

                    <div className='questrial' style={{ fontSize: 20 }}>
                        {i18n.lockScreen.title}
                    </div>

                    <div id='password'>
                        <input type="password" maxLength={32} />
                        <img src={lock} />
                    </div>
                </div>
            </div>
        );
    }

}
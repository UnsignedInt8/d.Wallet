import * as React from 'react';
import { getLang } from '../i18n';
import '../styles/NewKey.scss';
import * as bip39 from 'bip39';

const lock = require('../assets/padlock.svg');
const i18n = getLang();

interface State {
    mnemonic: string;
    password?: string;
    confirmPw?: string;
}

interface Props {
    onCancel: () => void;
}

export default class NewKey extends React.Component<Props, State> {

    state: State = { mnemonic: bip39.generateMnemonic() };

    render() {
        return (
            <div id='newkey-page' className='welcome-page'>
                <div id='newkey-content'>
                    <div className='title'>New Wallet</div>
                    <div style={{ fontSize: 14 }}>{i18n.welcome.new.attention}</div>
                    <div id='mnemonic'>
                        {this.state.mnemonic}
                    </div>

                    <div>{i18n.welcome.setPassword}</div>
                    <div className='password'>
                        <img src={lock} />
                        <input id='set-password' type="password" maxLength={32} onChange={e => this.setState({ password: e.target.value })} placeholder={i18n.welcome.password} />
                    </div>

                    <div className='password'>
                        <img src={lock} />
                        <input type="password" maxLength={32} onChange={e => this.setState({ confirmPw: e.target.value })} placeholder={i18n.welcome.confirmPassword} />
                    </div>
                </div>

                <div className='welcome-buttons'>
                    <button onClick={_ => this.props.onCancel()}>{i18n.buttons.cancel}</button>
                    <span>|</span>
                    <button className={`${this.state.password && this.state.password === this.state.confirmPw && this.state.password.length >= 6 ? '' : 'disabled'}`}>{i18n.buttons.ok}</button>
                </div>
            </div>
        );
    }
}
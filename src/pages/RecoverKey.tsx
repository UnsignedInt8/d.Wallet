import * as React from 'react';
import '../styles/RecoverKey.scss';
import { getLang } from '../i18n';
import * as bip39 from 'bip39';
import * as jquery from 'jquery';

const lock = require('../assets/padlock.svg');
const i18n = getLang();

interface Props {
    onCancel: () => void;
}

interface State {
    isValidMnemonic?: boolean;
    password?: string;
    confirmPw?: string;
}

console.log(bip39.generateMnemonic())
export default class RecoverKey extends React.Component<Props, State> {

    state: State = {};

    private onTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        let mnemonic = e.target.value.split(' ');
        if (mnemonic.length < 6) return;
        let isValid = bip39.validateMnemonic(e.target.value);
        this.setState({ isValidMnemonic: isValid });
        if (isValid) jquery('#set-password').focus();
    }


    render() {
        return (
            <div id='recover-page' className='welcome-page'>

                <div id='recover-content'>
                    <div className='title'>{i18n.welcome.recover.title}</div>
                    <div>{i18n.welcome.recover.typingMnemonic}</div>
                    <div style={{ marginBottom: 12 }}>
                        <textarea className={`${this.state.isValidMnemonic ? 'valid' : ''}`} id="mnemonic" rows={5} style={{}} onChange={e => this.onTextAreaChange(e)}></textarea>
                    </div>

                    <div>{i18n.welcome.setPassword}</div>
                    <div className='password'>
                        <img src={lock} />
                        <input id='set-password' type="password" maxLength={32} onChange={e => this.setState({ password: e.target.value })} placeholder={i18n.welcome.password} />
                    </div>

                    <div className='password'>
                        <img src={lock} />
                        <input id='set-password' type="password" maxLength={32} onChange={e => this.setState({ confirmPw: e.target.value })} placeholder={i18n.welcome.confirmPassword} />
                    </div>
                </div>

                <div className='welcome-buttons'>
                    <button onClick={_ => this.props.onCancel()}>{i18n.buttons.cancel}</button>
                    <span>|</span>
                    <button className={`${this.state.password && this.state.password === this.state.confirmPw && this.state.password.length >= 6 ? '' : 'disabled'}`}>{i18n.welcome.import}</button>
                </div>
            </div>
        );
    }
}
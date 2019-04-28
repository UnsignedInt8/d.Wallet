import * as React from 'react';
import '../styles/RecoverKey.scss';
import { getLang } from '../i18n';
import * as bip39 from 'bip39';
import * as jquery from 'jquery';
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';

const lock = require('../assets/padlock.svg');
const i18n = getLang();

interface Props {
    onCancel: () => void;
    onOk: () => void;
}

interface State {
    isValidMnemonic?: boolean;
    mnemonic?: string;
    password?: string;
    confirmPw?: string;
}

export default class RecoverKey extends React.Component<Props, State> {

    state: State = {};

    componentDidMount() {
        jquery('#mnemonic').focus();
    }

    private onTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        let mnemonic = e.target.value.split(' ');
        if (mnemonic.length < 6) return;
        let isValid = bip39.validateMnemonic(e.target.value);
        this.setState({ isValidMnemonic: isValid, mnemonic: e.target.value });
        if (isValid) jquery('#set-password').focus();
    }

    private onOkClick() {
        if (!this.state.isValidMnemonic) return;

        PassMan.password = this.state.password!;
        let appSettings = getAppSettings(PassMan.password);
        appSettings.mnemonic = this.state.mnemonic!;

        console.log(PassMan.password, appSettings.mnemonic);
        this.props.onOk();
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
                        <input type="password" maxLength={32} onChange={e => this.setState({ confirmPw: e.target.value })} placeholder={i18n.welcome.confirmPassword} />
                    </div>
                </div>

                <div className='welcome-buttons'>
                    <button onClick={_ => this.props.onCancel()}>{i18n.buttons.cancel}</button>
                    <span>|</span>
                    <button className={`${this.state.password && this.state.password === this.state.confirmPw && this.state.password.length >= 6 ? '' : 'disabled'}`} onClick={_ => this.onOkClick()}>{i18n.welcome.import}</button>
                </div>
            </div>
        );
    }
}
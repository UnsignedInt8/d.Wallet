import * as React from 'react';
import '../styles/RecoverKey.scss';
import { getLang } from '../i18n';
const lock = require('../assets/padlock.svg');
const i18n = getLang();

interface Props {
    onCancel: () => void;
}

export default class RecoverKey extends React.Component<Props, {}> {

    render() {
        return (
            <div id='recover-page' className='welcome-page'>

                <div id='recover-content'>
                    <div className='title'>{i18n.welcome.recover.title}</div>
                    <div>{i18n.welcome.recover.typingMnemonic}</div>
                    <div style={{ marginBottom: 12 }}>
                        <textarea id="mnemonic" rows={5} style={{}}></textarea>
                    </div>

                    <div>{i18n.welcome.recover.setPassword}</div>
                    <div className='password'>
                        <img src={lock} />
                        <input type="password" maxLength={32} />
                    </div>
                </div>

                <div className='welcome-buttons'>
                    <button onClick={_ => this.props.onCancel()}>{i18n.buttons.cancel}</button>
                    <span>|</span>
                    <button className='disabled'>{i18n.welcome.import}</button>
                </div>
            </div>
        );
    }
}
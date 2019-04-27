import * as React from 'react';
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';
import "../styles/ResetBox.scss";

interface Props {
    onCancel?: () => void;
    onReset?: () => void;
}

export default class ResetBox extends React.Component<Props, any> {

    appSettings = getAppSettings(PassMan.password);
    i18n = this.appSettings.i18n;

    render() {
        return (
            <div id='reset-box'>
                <div className='page-title'>{this.i18n.reset.title}</div>
                <div id='reset-desc'>
                    {this.i18n.reset.desc}
                </div>

                <div id='reset-buttons'>
                    <button id='reset-cancel' onClick={_ => this.props.onCancel!()}>{this.i18n.buttons.cancel}</button>
                    <span style={{ width: 16 }}> </span>
                    <button id='reset-ok' onClick={_ => this.props.onReset!()}>{this.i18n.reset.title}</button>
                </div>
            </div>
        );
    }
}
import * as React from 'react';
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';
import "../styles/ResetBox.scss";

export default class ResetBox extends React.Component {

    appSettings = getAppSettings(PassMan.password);
    i18n = this.appSettings.i18n;

    render() {
        return (
            <div id='reset-box'>
                <div className='page-title'>{this.i18n.reset.title}</div>
                <div></div>
            </div>
        );
    }
}
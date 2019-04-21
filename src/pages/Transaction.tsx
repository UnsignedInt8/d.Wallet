import * as React from 'react';
import '../styles/Transaction.scss';
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';

interface Props {

}

export default class Transaction extends React.Component<Props, any> {

    appSettings = getAppSettings(PassMan.password);
    i18n = this.appSettings.i18n;

    render() {
        return (
            <div id='transaction'>
                <div id='transaction-details'>

                </div>

                <div id='tx-buttons'>
                    <button id='close'>
                        {this.i18n.buttons.close}
                    </button>
                </div>
            </div>
        );
    }
}
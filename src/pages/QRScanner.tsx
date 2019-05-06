import * as React from 'react';
import * as QrReader from 'react-qr-reader';
import "../styles/QRScanner.scss";
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';

interface Props {
    onResult: (result: string | null) => void;
}

export default class QRScanner extends React.Component<Props, {}> {

    i18n = getAppSettings(PassMan.password).i18n;

    handleError = err => {

    };

    render() {
        return (
            <div id='scanner'>
                <QrReader
                    delay={300}
                    onError={this.handleError}
                    onScan={data => this.props.onResult(data)}
                    style={{ width: '100%', height: '100%' }}
                    showViewFinder={false}
                />

                <div id='view-border' />

                <button id='close-scanner'>
                    {this.i18n.buttons.close}
                </button>
            </div>
        );
    }
}
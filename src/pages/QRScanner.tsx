import * as React from 'react';
import * as QrReader from 'react-qr-reader';
import "../styles/QRScanner.scss";
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';
const url = require('url');
import { ParsedUrlQuery } from 'querystring';

export interface QResult {
    address?: string;
    query?: ParsedUrlQuery;
    protocol?: string;
}

interface Props {
    onResult: (opts: QResult) => void;
    onCancel: () => void;
}

export default class QRScanner extends React.Component<Props, {}> {

    i18n = getAppSettings(PassMan.password).i18n;

    handleError = err => {

    };

    handleData = (data: string | null) => {
        if (!data) return;
        let result = url.parse(data as string, true);
        if (!result.host) {
            this.props.onResult({ address: data });
            return;
        }

        let host = result.host as string || '';
        let protocol = result.protocol as string || '';
        if (!host) return;
        let lowercase = data.toLowerCase();
        let address = data.substring(lowercase.indexOf(host.toLowerCase()), host.length + protocol.length);
        
        this.props.onResult({ protocol: result.protocol, address, query: result.query });
    }

    render() {
        return (
            <div id='scanner'>
                <QrReader
                    delay={300}
                    onError={this.handleError}
                    onScan={this.handleData}
                    style={{ width: '100%', height: '100%' }}
                    showViewFinder={false}
                />

                <div id='view-border' />

                <button id='close-scanner' onClick={e => this.props.onCancel()}>
                    {this.i18n.buttons.close}
                </button>
            </div>
        );
    }
}
import * as React from 'react';
import QrReader from 'react-qr-reader';

interface Props {
    onResult: (result: string | null) => void;
}

export default class QRScanner extends React.Component<Props, {}> {

    handleError = err => {

    };

    render() {
        return (
            <div id='scanner'>
                <QrReader
                    delay={300}
                    onError={this.handleError}
                    onScan={data => this.props.onResult(data)}
                    style={{ width: '100%' }}
                />
            </div>
        );
    }
}
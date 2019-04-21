import * as React from 'react';
import '../styles/Transaction.scss';

interface Props {

}

export default class Transaction extends React.Component<Props, any> {

    render() {
        return (
            <div id='transaction'>
                <div id='transaction-details'>

                </div>

                <button id='close'>

                </button>
            </div>
        );
    }
}
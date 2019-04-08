import * as React from 'react';
import '../styles/NewKey.scss';
import { getLang } from '../i18n';

const i18n = getLang();

export default class NewKey extends React.Component {

    render() {
        return (
            <div id='newkey-page' className='welcome-page'>
                <div id='newkey-content'>

                </div>

                <div className='welcome-buttons'>
                    <button>{i18n.buttons.cancel}</button>
                    <span>|</span>
                    <button></button>
                </div>
            </div>
        );
    }
}
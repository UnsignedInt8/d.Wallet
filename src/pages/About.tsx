import * as React from 'react';
import '../styles/About.scss';
import PassMan from '../data/PasswordManager';
import { getAppSettings } from '../data/AppSettings';

const blockchair = require('../assets/blockchair_light.png');
const btcom = require('../assets/btc-com.png');
const coinranking = require('../assets/coinranking.svg');

export default class About extends React.Component {

    i18n = getAppSettings(PassMan.password).i18n;

    render() {
        return (
            <div id='about-page'>
                <div className='page-title'>
                    {this.i18n.about.title}
                </div>

                <div className='page-desc'>
                    {this.i18n.about.desc}
                </div>

                <div className='page-title title'>
                    {this.i18n.about.thanks}
                </div>

                <div id='about-thanks'>
                    <div><img id='blockchair' src={blockchair} /></div>
                    <div className='lato'><img id='coinranking' src={coinranking} /> Coinranking </div>
                    <div><img id='btc-com' src={btcom} /></div>
                </div>

                <div className='page-title title'>
                    {this.i18n.about.contact}
                </div>

                <div className='page-desc'>

                </div>
            </div>
        );
    }
}
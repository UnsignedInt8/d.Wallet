import * as React from 'react';
import '../styles/About.scss';
import PassMan from '../data/PasswordManager';
import { getAppSettings } from '../data/AppSettings';
import Particles from 'react-particles-js';
import { nightSky } from './Welcome';
import MiscHelper from '../lib/MiscHelper';

const blockchair = require('../assets/blockchair_light.png');
const btcom = require('../assets/btc-com.png');
const coinranking = require('../assets/coinranking.svg');
const github = require('../assets/github.svg');
const email = require('../assets/email.svg');
const home = require('../assets/home.svg');

interface Props {
    onCancel?: () => void;
}

export default class About extends React.Component<Props, {}> {

    i18n = getAppSettings(PassMan.password).i18n;

    openLink(url: string) {
        MiscHelper.openLink(url);
    }

    render() {
        return (
            <div id='about-page' onClick={_ => { }}>
                <Particles className='particlejs' params={nightSky} width={`100%`} height={`100%`} />

                <div className='page-title'>
                    {this.i18n.about.title}
                </div>

                <div className='page-desc'>
                    {this.i18n.about.desc}
                </div>

                <div className='page-title title'>
                    {this.i18n.about.thanks}
                </div>

                <div id='about-thanks' className='no-drag'>
                    <div className='no-drag clickable' onClick={_ => this.openLink('https://blockchair.com')} > <img id='blockchair' src={blockchair} /></div>
                    <div className='lato no-drag clickable' onClick={_ => this.openLink('https://coinranking.com')}><img id='coinranking' src={coinranking} /> Coinranking </div>
                    <div className='no-drag clickable' onClick={_ => this.openLink('https://btc.com')}><img id='btc-com' src={btcom} /></div>
                </div>

                <div className='page-title title'>
                    {this.i18n.about.contact}
                </div>

                <div id='contacts' className='page-desc'>
                    <div id='icons'>
                        <div><a href='#' onClick={_ => this.openLink('https://github.com')}><img src={github} /> </a></div>
                        <div><a href="#" onClick={_ => this.openLink('mailto:')}> <img src={email} /> </a> </div>
                        <div><a href="#" onClick={_ => this.openLink('https://d-wallet.app')}><img src={home} /> </a></div>
                    </div>
                </div>

                <div id='close'>
                    <button onClick={e => this.props.onCancel!()}>{this.i18n.buttons.close}</button>
                </div>
            </div >
        );
    }
}
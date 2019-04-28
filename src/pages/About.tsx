import * as React from 'react';
import '../styles/About.scss';
import PassMan from '../data/PasswordManager';
import { getAppSettings } from '../data/AppSettings';
const { shell } = require('electron');

const blockchair = require('../assets/blockchair_light.png');
const btcom = require('../assets/btc-com.png');
const coinranking = require('../assets/coinranking.svg');
const github = require('../assets/github.svg');

interface Props {
    onCancel?: () => void;
}

export default class About extends React.Component<Props, {}> {

    i18n = getAppSettings(PassMan.password).i18n;

    openLink(url: string) {
        shell.openExternal(url);
    }

    render() {
        return (
            <div id='about-page' onClick={_ => { }}>
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
                    <div><img id='blockchair' src={blockchair} onClick={_ => this.openLink('https://blockchair.com')} /></div>
                    <div className='lato'><img id='coinranking' src={coinranking} onClick={_ => this.openLink('https://coinranking.com')} /> Coinranking </div>
                    <div><img id='btc-com' src={btcom} onClick={_ => this.openLink('https://btc.com')} /></div>
                </div>

                <div className='page-title title'>
                    {this.i18n.about.contact}
                </div>

                <div id='contacts' className='page-desc'>
                    <div><img src={github} /> <a href='#' onClick={_ => this.openLink('https://github.com')}>Github</a></div>
                </div>

                <div id='close'>
                    <button onClick={e => this.props.onCancel!()}>{this.i18n.buttons.close}</button>
                </div>
            </div>
        );
    }
}
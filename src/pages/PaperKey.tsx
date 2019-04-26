import * as React from 'react';
import "../styles/PaperKey.scss";
import PassMan from '../data/PasswordManager';
import { getAppSettings } from '../data/AppSettings';
import BTCWallet from '../wallet/BTCWallet';
import BCHWallet from '../wallet/BCHWallet';
import ETHWallet from '../wallet/ETHWallet';
import LTCWallet from '../wallet/LTCWallet';

interface State {
    mouseIn?: boolean;
}

const derivationPaths = [
    { img: require('../assets/btc.svg'), path: BTCWallet.defaultPath },
    { img: require('../assets/bch.svg'), path: BCHWallet.defaultPath },
    { img: require('../assets/eth.svg'), path: ETHWallet.defaultPath },
    { img: require('../assets/ltc.svg'), path: LTCWallet.defaultPath },
    { img: require('../assets/usdt.svg'), path: BTCWallet.defaultPath },
]

export default class PaperKey extends React.Component<{}, State> {

    appSettings = getAppSettings(PassMan.password);
    i18n = this.appSettings.i18n;
    state: State = {};

    render() {
        return (
            <div id='paper-key'>
                <div className='page-title'>
                    {this.i18n.paperKey.title}
                </div>

                <div id='paper-key-desc'>
                    {this.i18n.paperKey.backup}
                </div>

                <div id='mnemonic-phrases' onMouseEnter={e => this.setState({ mouseIn: true })} onMouseLeave={e => this.setState({ mouseIn: false })}>
                    {this.state.mouseIn ?
                        this.appSettings.mnemonic
                        : `•••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• ••••`}
                </div>

                <div id='derivation-path-title' className='questrial'>
                    {this.i18n.paperKey.derivationPath}
                </div>

                <div id='derivation-path'>
                    {
                        derivationPaths.map((v, i) => {
                            return (
                                <div>
                                    <img src={v.img} />
                                    <span>{v.path}</span>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
import * as React from 'react';
import '../styles/PaymentDetails.scss';
import anime from 'animejs';
import { getLang } from '../i18n';
import { getAppSettings } from '../data/AppSettings';
import PassMan from '../data/PasswordManager';
import { Validation, Password } from '../components';
import { Flip, Fade } from 'react-reveal';
import * as jquery from 'jquery';

interface Props {
    to?: { address: string, amount: number }[],
    from?: string[],
    message?: string;
    fee?: number;
    onClose: () => void;
    onVerified: () => void;
    symbol?: string;
    coinUnit: string;
}

interface State {
    validatingPassword?: boolean;
    validPassword?: boolean;
}

const cancelWhite = require('../assets/cancel-white.svg');
const cancelIcon = require('../assets/cancel.svg');

export default class PaymentDetails extends React.Component<Props, State> {

    state: State = {}
    appSettings = getAppSettings(PassMan.password);
    i18n = getLang(this.appSettings.lang);

    private onPasswordChange(value: string) {
        if (!PassMan.verify(value)) return;
        this.setState({ validPassword: true });
        this.props.onVerified();
    }

    private jumpToPassword() {
        anime({
            targets: '#payment-content, #payment-actions',
            translateX: [0, -window.innerWidth],
            opacity: 0,
            duration: 600,
            easing: 'linear',
        });

        anime({
            targets: '#payment-validation',
            translateX: [-window.innerWidth, 0],
            duration: 600,
            easing: 'linear',
            complete: () => this.setState({ validatingPassword: true }),
        });

        this.setState({ validatingPassword: false });
    }

    close() {
        let height = jquery('#payment-details').height();

        anime({
            targets: '#payment-details',
            translateY: [0, height],
            easing: 'easeInQuad',
            duration: 600,
            complete: () => this.props.onClose()
        });
    }

    open() {
        let height = jquery('#payment-details').height();

        anime({
            targets: '#payment-details',
            translateY: [height, 0],
            duration: 100,
        });
    }

    render() {
        return (

            <div id='payment-details' className={`${this.state.validatingPassword ? 'validatingPassword' : undefined}`}>
                <div id='payment-title' className='questrial'>
                    <Flip bottom opposite cascade when={this.state.validatingPassword}>{this.state.validatingPassword ? 'Validate Password' : 'Transaction Details'}</Flip>
                </div>

                <img id='close-payment' src={this.state.validatingPassword ? cancelWhite : cancelIcon} onClick={_ => this.close()} />

                <div id='payment-content'>

                    <div className='payment-details-item'>
                        <div className='title amount-title'>
                            Amount:
                    </div>
                        <div className='content amount'>
                            1.2323 <span className='symbol'>{this.props.symbol}</span>
                        </div>
                    </div>

                    <div className='payment-details-item'>
                        <div className='title'>
                            From:
                    </div>
                        <div className='content'>
                            {
                                (this.props.from || []).map((v, i) => {
                                    return (
                                        <div key={i} >
                                            {v}
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>

                    <div className='payment-details-item'>
                        <div className='title'>
                            To:
                    </div>
                        <div className='content'>
                            {
                                (this.props.to || []).map((v, i) => {
                                    return (
                                        <div key={i} className='toInfo'>
                                            <div className='to'>{v.address}</div>
                                            <div className='amount'>{v.amount}</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>

                    <div className='payment-details-item'>
                        <div className='title'>
                            Message:
                    </div>
                        <div className='content'>
                            {this.props.message}
                        </div>
                    </div>

                    <div className='payment-details-item'>
                        <div className='title'>
                            Fee:
                    </div>
                        <div className='content'>
                            {this.props.fee} <span>{this.props.coinUnit}</span>
                        </div>
                    </div>

                </div>

                <div id='payment-validation'>
                    {this.state.validPassword ? <Validation id='validation' /> : undefined}
                    <Password onChange={v => this.onPasswordChange(v)} inputStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', color: 'white' }} />
                </div>

                <div id='payment-actions'>
                    <button onClick={_ => this.jumpToPassword()}>{this.i18n.buttons.next}</button>
                </div>
            </div>

        );
    }
}
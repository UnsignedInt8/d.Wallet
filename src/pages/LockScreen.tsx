import * as React from 'react';
import '../styles/LockScreen.scss';
import * as Clock from 'react-live-clock';
import { getLang } from '../i18n';
import * as jquery from 'jquery';
import PassMan from '../data/PasswordManager';
import { getAppSettings } from '../data/AppSettings';
import { Validation, Password } from '../components';

const lock = require('../assets/padlock.svg');
const i18n = getLang();

interface State {
    validated: boolean;
}

interface Props {
    onValidationPass: () => void;
}

export default class LockScreen extends React.Component<Props, State> {

    static readonly id = '#lock-screen';

    state: State = { validated: false }

    componentDidMount() {
        jquery('input').focus();
    }

    private onPasswordChange(e: string) {
        if (this.state.validated) return;

        let validated = PassMan.verify(e);
        this.setState({ validated });

        if (!validated) return;
        if (!PassMan.password) {
            PassMan.password = e;
            getAppSettings(PassMan.password);
        }

        setTimeout(() => this.props.onValidationPass(), 1500);
    }

    render() {
        return (
            <div id='lock-screen'>
                <div id='clock'><Clock className='clock questrial' format={'HH:mm:ss'} ticking={true} /></div>
                <div id='security'>
                    {
                        this.state.validated ?
                            <Validation id='validation' />
                            : undefined
                    }

                    <div className='questrial' style={{ fontSize: 20 }}>
                        {i18n.lockScreen.title}
                    </div>

                    <Password onChange={value => this.onPasswordChange(value)} style={{ marginTop: 8 }} />
                </div>
            </div>
        );
    }

}
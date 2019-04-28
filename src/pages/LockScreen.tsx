import * as React from 'react';
import '../styles/LockScreen.scss';
import * as Clock from 'react-live-clock';
import { getLang } from '../i18n';
import * as jquery from 'jquery';
import PassMan from '../data/PasswordManager';
import { getAppSettings } from '../data/AppSettings';
import { Validation, Password } from '../components';

const i18n = getLang();

interface State {
    validated: boolean;
}

interface Props {
    onValidationPass: () => void;
    style?: React.CSSProperties;
}

export default class LockScreen extends React.Component<Props, State> {

    static readonly id = '#lock-screen';
    state: State = { validated: false }

    private pwInput!: Password;

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

        setTimeout(() => {
            this.props.onValidationPass();
            this.setState({ validated: false });
            this.pwInput.clean();
        }, 1500);
    }

    render() {
        return (
            <div id='lock-screen' style={this.props.style}>
                <div id='clock'><Clock className='clock questrial' format={'HH:mm:ss'} ticking={true} /></div>
                <div id='security'>
                    {
                        this.state.validated ?
                            <Validation id='lock-screen-validation' />
                            : undefined
                    }

                    <div className='questrial' style={{ fontSize: 20 }}>
                        {i18n.lockScreen.title}
                    </div>

                    <Password ref={e => this.pwInput = e!} onChange={value => this.onPasswordChange(value)} style={{ marginTop: 8 }} />
                </div>
            </div>
        );
    }

}
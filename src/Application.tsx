import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import { Home, Welcome, Send } from './pages';
import { spring } from 'react-motion';
import { History } from 'history';
import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react';
import LockScreen from './pages/LockScreen';
import animeHelper from './lib/AnimeHelper';
import { getAppSettings } from './data/AppSettings';
import PassMan from './data/PasswordManager';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

function glide(val: number) {
    return spring(val, {
        stiffness: 200,
        damping: 24,
    });
}

function slide(val: number) {
    return spring(val, {
        stiffness: 125,
        damping: 16,
    });
}

const pageTransitions = {
    atEnter: {
        offset: window.innerWidth,
    },
    atLeave: {
        offset: glide(-window.innerWidth),
    },
    atActive: {
        offset: glide(0),
    },
};

interface State {
    lockApp: boolean;
    firstUse?: boolean;
}

@observer
export default class Application extends React.Component<{}, State> {

    static history: History;

    state: State = { lockApp: false, firstUse: true };
    notificationDOMRef: any;

    componentDidMount() {
        ipcRenderer.on('autolock', () => this.lockApp());
        PassMan.on('password', this.onPasswordChanged);

        let firstUse = !PassMan.isProtected();
        this.setState({ firstUse }, () => {
            if (!PassMan.isProtected()) Application.history.push('/welcome');
            if (PassMan.isProtected() && !PassMan.password) this.lockApp(true);
        });

        setTimeout(() => this.addNotification({ title: '', message: 'hello', type: 'success' }), 2000);
    }

    componentWillUnmount() {
        PassMan.removeListener('password', this.onPasswordChanged);
    }

    private onPasswordChanged = () => {
        this.setState({ firstUse: false });
    }

    private lockApp(force = false) {
        if (this.state && this.state.lockApp) return;
        if (!PassMan.isProtected()) return;

        if (!force) {
            if (!PassMan.password) return;
            let appSettings = getAppSettings(PassMan.password);
            if (!appSettings.autolock) return;
        }

        this.setState({ lockApp: true }, () => animeHelper.expandPage(LockScreen.id, window.innerHeight, 0));
    }

    private unlockApp() {
        animeHelper.expandPage(LockScreen.id, 0, window.innerHeight, () => this.setState({ lockApp: false }));
    }

    addNotification(opts: { title: string, message: string, type: 'success' | 'default' | 'warning' | 'info' | 'danger' }) {
        this.notificationDOMRef.addNotification({
            ...opts,
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: { duration: 2000 },
            dismissable: { click: true }
        });
    }

    render() {
        return (
            <Router ref={e => e ? Application.history = e!['history'] : undefined}>
                <ReactNotification ref={e => this.notificationDOMRef = e} isMoble={true} width={300} />

                <AnimatedSwitch
                    className='switch'
                    {...pageTransitions}
                    mapStyles={styles => ({
                        transform: `translateX(${styles.offset}%)`,
                    })}
                >
                    <Route path='/welcome' exact component={Welcome} />
                    {!this.state.firstUse ? <Route path="/" component={Home} /> : undefined}
                </AnimatedSwitch>

                {this.state.lockApp ?
                    <LockScreen onValidationPass={() => this.unlockApp()} />
                    : undefined
                }
            </Router>
        );
    }
}

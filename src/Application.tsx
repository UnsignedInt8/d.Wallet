import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import { Home, Welcome, Send } from './pages';
import { spring } from 'react-motion';
import { History } from 'history';
import { ipcRenderer, } from 'electron';
import { observer } from 'mobx-react';
import LockScreen from './pages/LockScreen';
import animeHelper from './lib/AnimeHelper';
import { getAppSettings } from './data/AppSettings';
import PassMan from './data/PasswordManager';
import "./styles/Application.scss";
import AnimeHelper from './lib/AnimeHelper';

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

    private static app: Application;
    static history: History;
    state: State = { lockApp: false, firstUse: true };

    componentDidMount() {

        ipcRenderer.on('autolock', () => this.lockApp());
        PassMan.on('password', this.onPasswordChanged);

        let firstUse = !PassMan.isProtected();
        this.setState({ firstUse }, () => {
            if (PassMan.isProtected() && !PassMan.password) this.lockApp(true);
        });

        Application.app = this;
    }

    componentWillUnmount() {
        PassMan.removeListener('password', this.onPasswordChanged);
    }

    private onPasswordChanged = () => {

        if (this.state.firstUse) {
            process.nextTick(() => {
                const remote = require('electron').remote;
                remote.app.relaunch();
                remote.app.exit(0);
            });
            return;
        }

        this.setState({ firstUse: false });
    }

    private lockApp(force = false, cb?: () => void) {
        if (this.state && this.state.lockApp) return;
        if (!PassMan.isProtected()) return;

        if (!force) {
            if (!PassMan.password) return;
            let appSettings = getAppSettings(PassMan.password);
            if (!appSettings.autolock) return;
        }

        this.setState({ lockApp: true }, () => animeHelper.expandPage(LockScreen.id, window.innerHeight, 0, cb));
    }

    private unlockApp() {
        animeHelper.expandPage(LockScreen.id, 0, window.innerHeight, () => this.setState({ lockApp: false }));
    }

    static lock(cb?: () => void) {
        this.app.lockApp(true, cb);
    }

    render() {
        return (
            <Router ref={e => e ? Application.history = e!['history'] : undefined}>

                <AnimatedSwitch
                    className='switch'
                    {...pageTransitions}
                    mapStyles={styles => ({
                        transform: `translateX(${styles.offset}%)`,
                    })}
                >

                    {this.state.firstUse ? <Route path='/' component={Welcome} /> : <Route path='/' component={Home} />}

                </AnimatedSwitch>

                {this.state.lockApp ?
                    <LockScreen style={{ zIndex: 999, }} onValidationPass={() => this.unlockApp()} />
                    : undefined}
            </Router>
        );
    }
}


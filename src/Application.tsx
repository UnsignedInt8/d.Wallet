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
}

@observer
export default class Application extends React.Component<{}, State> {

    static history: History;

    state: State = { lockApp: false };

    componentDidMount() {
        ipcRenderer.on('autolock', () => this.lockApp());
        if (PassMan.isProtected() && !PassMan.password) this.setState({ lockApp: true });
    }

    private lockApp() {
        if (this.state && this.state.lockApp) return;
        if (!PassMan.isProtected()) return;

        let appSettings = getAppSettings(PassMan.password);
        if (!appSettings.autolock) return;

        this.setState({ lockApp: true }, () => animeHelper.expandPage(LockScreen.id, window.innerHeight, 0));
    }

    private unlockApp() {
        animeHelper.expandPage(LockScreen.id, 0, window.innerHeight, () => this.setState({ lockApp: false }));
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
                    <Route path='/welcome' exact component={Welcome} />
                    <Route path="/" component={Home} />
                </AnimatedSwitch>

                {this.state.lockApp ?
                    <LockScreen onValidationPass={() => this.unlockApp()} />
                    : undefined}

            </Router>
        );
    }
}

import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import { Home, Welcome, Send } from './pages';
import { spring } from 'react-motion';
import { History } from 'history';
import { ipcRenderer, remote } from 'electron';
import { observer } from 'mobx-react';
import LockScreen from './pages/LockScreen';
import animeHelper from './lib/AnimeHelper';
import { getAppSettings } from './data/AppSettings';
import PassMan from './data/PasswordManager';
import "./styles/Application.scss";
import * as jquery from 'jquery';
import { withToastManager, } from 'react-toast-notifications';
import { getLang } from './i18n';
import MiscHelper from './lib/MiscHelper';
import UIHelper from './lib/UIHelper';

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
export class Application extends React.Component<any, State> {

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

        setTimeout(() => jquery('.quit').focus(), 2000);
    }

    componentWillUnmount() {
        PassMan.removeListener('password', this.onPasswordChanged);
    }

    private onPasswordChanged = () => {

        if (this.state.firstUse) {
            let i18n = getLang();
            this.notify({ message: i18n.messages.firstUseRelaunch, appearance: 'success' });
            setTimeout(() => MiscHelper.relaunch(), 3000);
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

    notify(opts: { message: string, appearance: 'success' | 'error' }) {
        let { toastManager } = this.props;
        toastManager.add(opts.message, { appearance: opts.appearance, autoDismiss: true });
    }

    static notify(opts: { message: string, appearance: 'success' | 'error' }) {
        Application.app.notify(opts);
    }

    handleWindow(action: 'close' | 'maximize' | 'minimize') {
        let win = remote.BrowserWindow.getFocusedWindow();
        if (!win) return;

        switch (action) {
            case 'maximize':
                win.maximize();
                break;
            case 'minimize':
                win.minimize();
                break;
            case 'close':
                win.close();
                break;
        }
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

                {!UIHelper.isDarwin ?
                    <div id='win-title-bar'>
                        <button className='minimize no-drag' onClick={_ => this.handleWindow('minimize')}>
                            <img src={require('./assets/win-minimize.svg')} draggable={false} />
                        </button>
                        <button className='maximize no-drag' onClick={_ => this.handleWindow('maximize')}>
                            <img src={require('./assets/win-maximize.svg')} draggable={false} />
                        </button>
                        <button className='quit no-drag' onClick={_ => this.handleWindow('close')}>
                            <img src={require('./assets/win-close.svg')} draggable={false} />
                        </button>
                    </div>
                    : undefined
                }

            </Router>
        );
    }
}

export default withToastManager(Application);
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import ApplicationWrapper, { Application } from './Application';
import './styles/index.scss';
import * as linq from 'linq';
const { clipboard } = require('electron');
import { ToastProvider, } from 'react-toast-notifications';
import AppVersion from './data/AppVersion';

linq.enable();
AppVersion.check();

// https://github.com/bitpay/bitcore/issues/1457#issuecomment-467594031
Object.defineProperty(global, '_bitcore', { get() { return undefined }, set() { } });
document.title = 'd.Wallet';


// Create main element
const mainElement = document.createElement('div');
mainElement.classList.add('app-drag');
document.body.appendChild(mainElement);

// Render components
const render = (Component: () => JSX.Element) => {
    ReactDOM.render(
        <ToastProvider autoDismissTimeout={3000} className='toastprovider'
            styles={{
                container: (provided) => ({ ...provided, zIndex: 100000, })
            }}>
            <Component />
        </ToastProvider>,
        mainElement
    );
};

render(() => <ApplicationWrapper />);

// Hot Module Replacement API
if (typeof module.hot !== 'undefined') {
    module.hot.accept('./Application', () => {
        import('./Application').then(World => {
            render(() => <World.default />);
        });
    });
}

const keyCodes = {
    V: 86,
    L: 76,
};

document.onkeydown = function (event) {
    let toReturn = true;

    if (event.ctrlKey || event.metaKey) {  // detect ctrl or cmd
        switch (event.which) {
            case keyCodes.V:
                let activeEl = document.activeElement as HTMLInputElement;
                if (!activeEl) return;
                activeEl.value += clipboard.readText();
                activeEl.dispatchEvent(new Event('input'));
                toReturn = false;
                break;
        }

    }

    return toReturn;
}
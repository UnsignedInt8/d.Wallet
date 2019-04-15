import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Application from './Application';
import './styles/index.scss';
import * as kinq from 'kinq';

kinq.enable();

// https://github.com/bitpay/bitcore/issues/1457#issuecomment-467594031
Object.defineProperty(global, '_bitcore', { get() { return undefined }, set() { } })

// Create main element
const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

// Render components
const render = (Component: () => JSX.Element) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        mainElement
    );
};

render(() => <Application />);

// Hot Module Replacement API
if (typeof module.hot !== 'undefined') {
    module.hot.accept('./Application', () => {
        import('./Application').then(World => {
            render(() => <World.default />);
        });
    });
}

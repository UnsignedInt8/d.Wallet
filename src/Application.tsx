import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import { Home, Welcome, Send } from './pages';
import { spring } from 'react-motion';
import { History } from 'history';
import PersistenceHelper from './lib/PersistenceHelper';

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

export default class Application extends React.Component {

    static history: History;

    render() {
        return (
            <Router ref={e => e ? Application.history = e!['history'] : undefined}>
                <AnimatedSwitch
                    // css={switchRule}
                    className='switch'
                    {...pageTransitions}
                    mapStyles={styles => ({
                        transform: `translateX(${styles.offset}%)`,
                    })}
                >
                    <Route path='/welcome' exact component={Welcome} />
                    <Route path='/send' component={Send} />
                    <Route path="/" component={Home} />
                </AnimatedSwitch>
            </Router>
        );
    }
}

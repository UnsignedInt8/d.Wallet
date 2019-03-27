import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import { Home } from './pages';

const Application = () => (
    <Router>
        <AnimatedSwitch atEnter={{ opacity: 0 }} atLeave={{ opacity: 0 }} atActive={{ opacity: 1 }}>
            <Route path="/" component={Home} />
        </AnimatedSwitch>
    </Router>
);

export default Application;

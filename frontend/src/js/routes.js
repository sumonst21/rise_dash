import React from 'react';
import {Route} from 'react-router';

import App from './components/app';
import Main from './components/report_page/report_page';
import MainPage from './components/main_page';
import { loggedIn } from './components/auth/auth.js';
import Login from './components/auth/login.js';


function requireAuth (nextState, replace) {
    if (!loggedIn()) {
        replace({
            pathname: '/login/',
            state: {nextPathname: '/'}
        })
    }
}

export default (
    <Route component={App} >
        <Route path="" component={ MainPage } onEnter={requireAuth} >
        {/*<Route path="" component={ MainPage } >*/}
            <Route path="/" component={ Main } />
        </Route>
        <Route path="/login/" component={ Login } />
    </Route >
);
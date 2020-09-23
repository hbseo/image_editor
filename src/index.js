import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import App from './components/App';

import Error from './components/Error';

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/" component={App} />

            <Route component={Error}/>
        </Switch>
    </Router>,
    document.getElementById('root')
);

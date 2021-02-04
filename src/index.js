import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Error from './components/Error';
import Main from './components/Main';
import ImageEditor from './components/ImageEditor';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ChangePassword from './components/Change_password';
import { Route, Switch } from 'react-router';


ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Main} />
			<Route exact path="/edit" component={ImageEditor} />
      <Route exact path="/login" component={SignIn} />
      <Route exact path="/register" component={SignUp} />
      <Route exact path="/ChangePassword/:id" component={ChangePassword} />
      <Route component={Error} />
    </Switch>
  </Router>,
  document.getElementById('root')
);

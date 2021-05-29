import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Error from './components/Error';
import Main from './components/Main';
import ImageEditor from './components/ImageEditor';
import ImageFilter from './components/ImageFilter';
import Home from './components/Home';
import Helper from './components/Helper';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ChangePassword from './components/Change_password';
import FindPassword from './components/Find_password';
import { Route, Switch } from 'react-router';
import { PublicRoute, PrivateRoute } from './Route';


ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/Main" component={Main} />
			<Route exact path="/edit" component={ImageEditor} />
			<Route exact path="/filter" component={ImageFilter} />
			<Route exact path="/" component={Home} />
      <Route path="/helper" component={Helper} />
      {/* <Route exact path="/login" component={SignIn} /> */}
      {/* <Route exact path="/register" component={SignUp} /> */}
      {/* <Route exact path="/ChangePassword/:id" component={ChangePassword} /> */}
      {/* <Route exact path="/find" component={FindPassword} /> */}
      <PublicRoute exact path="/login" restricted component={SignIn}/>
      <PublicRoute exact path="/register" restricted component={SignUp}/>
      <PublicRoute exact path="/find" restricted component={FindPassword} />
      <PrivateRoute exact path="/ChangePassword/:id" component={ChangePassword} />
      <Route component={Error} />
    </Switch>
  </Router>,
  document.getElementById('root')
);

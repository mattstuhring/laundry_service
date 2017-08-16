import React from 'react';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import Home from 'Home';
import Main from 'Main';
import Login from 'Login';
import Profile from 'Profile';

export class Routes extends React.Component {
  render() {
    return <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Home}/>
        <Route path="login" component={Login}/>
        <Route path="profile" component={Profile}/>
      </Route>
    </Router>;
  }
}

export default Routes;

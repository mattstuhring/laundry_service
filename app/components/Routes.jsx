import React from 'react';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import Home from 'Home';
import Main from 'Main';
import Login from 'Login';
import AdminProfile from 'AdminProfile';
import CustomerProfile from 'CustomerProfile';
import EmployeeProfile from 'EmployeeProfile';

export default class Routes extends React.Component {
  render() {
    return <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Home}/>
        <Route path="login" component={Login}/>
        <Route path="adminProfile" component={AdminProfile}/>
        <Route path="customerProfile" component={CustomerProfile}/>
        <Route path="employeeProfile" component={EmployeeProfile}/>
      </Route>
    </Router>;
  }
}

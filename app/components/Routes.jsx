import React from 'react';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import Home from 'Home';
import Main from 'Main';
import Login from 'Login';
import AdminContainer from 'AdminContainer';
import AdminOrders from 'AdminOrders';
import AdminUsers from 'AdminUsers';
import CustomerProfile from 'CustomerProfile';
import EmployeeProfile from 'EmployeeProfile';
import ForgotPassword from 'ForgotPassword';
import ResetPassword from 'ResetPassword';
import Playground from 'Playground';
import Faq from 'Faq';

import Success from 'Success';
import Failure from 'Failure';

export default class Routes extends React.Component {
  render() {
    return <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Home}/>
        <Route path="login" component={Login}/>
        <Route path="adminContainer" component={AdminContainer}/>
        <Route path="adminOrders" component={AdminOrders}/>
        <Route path="adminUsers" component={AdminUsers}/>
        <Route path="customerProfile" component={CustomerProfile}/>
        <Route path="employeeProfile" component={EmployeeProfile}/>
        <Route path="forgotPassword" component={ForgotPassword}/>
        <Route path="resetPassword" component={ResetPassword}/>
        <Route path="success" component={Success}/>
        <Route path="failure" component={Failure}/>
        <Route path="faq" component={Faq}/>


        <Route path="playground" component={Playground}/>
      </Route>
    </Router>;
  }
}

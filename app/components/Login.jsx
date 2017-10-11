import React from 'react';
import { browserHistory, withRouter, Link } from 'react-router';
import axios from 'axios';
import {Tabs, Tab, Button, FormGroup, FormControl, InputGroup, Panel, PageHeader, HelpBlock, Alert, Image} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';

export class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      address: '',
      email: '',
      phoneNumber: '',
      password: '',
      passwordCheck: '',
      honeypot: ''
    }

    this.handleLogin = this.handleLogin.bind(this);
  }

  // LOGIN
  handleLogin() {

    const { email, password } = this.state;
    const customer = { email, password };

    axios.post('/api/token', customer)
      .then((res) => {
        const token = res.data;
        const decoded = jwtDecode(res.data);
        const user = {
          userId: decoded.userId,
          access: decoded.access,
          token: token
        };

        if (localStorage) {
          localStorage.setItem( 'user', JSON.stringify(user) );
          // console.log(JSON.parse( localStorage.getItem( 'user' ) ), 'if Stored token!');
        } else {
          alert("Sorry, your browser do not support local storage.");
        }

        let profile;

        if (decoded.access === 'admin') {
          profile = '/adminContainer';
        } else if (decoded.access === 'employee') {
          profile = '/employeeProfile';
        } else if (decoded.access === 'customer') {
          profile = '/customerProfile';
        } else {
          profile = '/login';
        }

        browserHistory.push(profile);
      })
      .catch((err) => {
        console.log(err);
        this.props.setToast('Invalid email or password!', {type: 'error'});
      });
  }


  // SIGN UP
  handleSubmit(event) {
    event.preventDefault();
    const { firstName, lastName, address, email, password, passwordCheck, honeypot } = this.state;
    let { phoneNumber } = this.state;

    let regexNum = phoneNumber.replace(/\D/g,'');
    let formatPhoneNum = '';

    if (regexNum.length === 10) {
      for (var i = 0; i < regexNum.length; i++) {
        if (i < 3) {
          formatPhoneNum += regexNum[i];
        } else if (i === 3) {
          formatPhoneNum += '-';
          formatPhoneNum += regexNum[i];
        } else if (i > 3 && i < 6) {
          formatPhoneNum += regexNum[i];
        } else if (i === 6) {
          formatPhoneNum += '-';
          formatPhoneNum += regexNum[i];
        } else if (i > 6) {
          formatPhoneNum += regexNum[i];
        }
      }
    }

    if (honeypot === '' && password === passwordCheck && firstName !== '' && lastName !== '' && address !== '' && email !== '' && phoneNumber !== '') {
      const { firstName, lastName, address, email, password } = this.state;
      phoneNumber = formatPhoneNum;
      const newUser = { firstName, lastName, address, email, phoneNumber, password };

      axios.post('/api/users', newUser)
        .then((res) => {
          this.setState({
            firstName: '',
            lastName: '',
            address: '',
            email: '',
            phoneNumber: '',
            password: '',
            key: 1
          });

          this.props.setToast('Thank you for signing up!', {type: 'success'});
        })
        .catch((err) => {
          console.log(err);
          this.props.setToast('The email has already been taken.', {type: 'error'});
        });
    } else {
      console.log('ERROR!!!');
      this.props.setToast('All form fields are required!', {type: 'error'});
    }
  }


  // HANDLE FORM INPUT EVENT CHANGES
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSelect(key) {
    this.setState({key});
  }

  getPasswordValidationState() {
    const { password } = this.state;

    if (password.length > 0) {
      return 'success';
    }
  }

  getValidationState() {
    const { password, passwordCheck } = this.state;

    if (password === passwordCheck && password.length > 0 && passwordCheck.length > 0) {
      return 'success';
    } else if (password === '') {
      return null;
    } else {
      return 'error';
    }
  }



  // ****************************  RENDER  *********************************
  render() {
    return (
      <div className="row user-login">
        <div className="col-xs-12 col-sm-12">


          <div className="row login-header">
            <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 text-center">
              <div className="page-header">
                <Image src="images/company.svg"/>
              </div>
            </div>
          </div>


          <div className="row login-row">
            <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 login-col">

              {/* LOGIN */}
              <Tabs defaultActiveKey={1} activeKey={this.state.key} onSelect={this.handleSelect} id="loginTabs">
                <Tab eventKey={1} title="LOG IN">
                  <div className="row">
                    <div className="col-xs-12 col-sm-12">
                      {/* <form onSubmit={this.handleLogin.bind(this)}> */}
                      <form>
                        <div className="login-form-wrapper">
                          <FormGroup controlId="email" bsSize="large">
                            <InputGroup>
                              <InputGroup.Addon>
                                <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
                              </InputGroup.Addon>
                              <FormControl
                                type="text"

                                placeholder="Email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChange.bind(this)}
                              />
                            </InputGroup>
                          </FormGroup>
                          <FormGroup controlId="user" bsSize="large">
                            <InputGroup>
                              <InputGroup.Addon>
                                <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
                              </InputGroup.Addon>
                              <FormControl
                                type="password"

                                placeholder="Password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChange.bind(this)}
                              />
                            </InputGroup>
                            <div className="text-right">
                              <Link to="/forgotPassword"><p><small><em>Forgot password?</em></small></p></Link>
                            </div>
                          </FormGroup>
                        </div>

                        <div className="row btn-actions">
                          <div className="col-xs-12 col-sm-12 text-center">
                            <Button
                              bsStyle="primary"
                              type="button"
                              onClick={() => {this.handleLogin()}}
                              block
                            >
                              LOG IN
                            </Button>
                          </div>
                          {/* <div className="col-sm-6">
                            <Button
                              bsStyle="primary"
                              type="button"
                              onClick={() => browserHistory.push('/')}
                              block
                            >
                              Cancel
                            </Button>
                          </div> */}
                        </div>
                      </form>
                    </div>
                  </div>
                </Tab>






                {/* SIGN UP */}
                <Tab eventKey={2} title="SIGN UP">
                  <div className="row">
                    <div className="col-sm-12">
                      <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="row">
                          <div className="col-sm-6">
                            <FormGroup controlId="user" bsSize="large">
                              <InputGroup>
                                <InputGroup.Addon>
                                  <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
                                </InputGroup.Addon>
                                <FormControl
                                  type="text"
                                  placeholder="First name"
                                  name="firstName"
                                  value={this.state.firstName}
                                  onChange={this.handleChange.bind(this)}
                                />
                              </InputGroup>
                            </FormGroup>
                          </div>
                          <div className="col-sm-6">
                            <FormGroup controlId="user" bsSize="large">
                              <FormControl
                                type="text"
                                placeholder="Last name"
                                name="lastName"
                                value={this.state.lastName}
                                onChange={this.handleChange.bind(this)}
                              />
                            </FormGroup>
                          </div>
                        </div>
                        <FormGroup controlId="user" bsSize="large">
                          <InputGroup>
                            <InputGroup.Addon>
                              <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
                            </InputGroup.Addon>
                            <FormControl
                              type="text"
                              placeholder="Address"
                              name="address"
                              value={this.state.address}
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup controlId="user" bsSize="large">
                          <InputGroup>
                            <InputGroup.Addon>
                              <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
                            </InputGroup.Addon>
                            <FormControl
                              type="email"
                              placeholder="Email"
                              name="email"
                              value={this.state.email}
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup controlId="user" bsSize="large">
                          <InputGroup>
                            <InputGroup.Addon>
                              <span className="glyphicon glyphicon-phone" aria-hidden="true"></span>
                            </InputGroup.Addon>
                            <FormControl
                              type="text"
                              placeholder="Phone number"
                              name="phoneNumber"
                              value={this.state.phoneNumber}
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>
                        </FormGroup>


                        <div className="row">
                          <div className="col-sm-6">
                            <FormGroup controlId="user" bsSize="large" validationState={this.getPasswordValidationState()}>
                              <InputGroup>
                                <InputGroup.Addon>
                                  <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
                                </InputGroup.Addon>
                                <FormControl
                                  type="password"
                                  placeholder="Password"
                                  name="password"
                                  value={this.state.password}
                                  onChange={this.handleChange.bind(this)}
                                />
                              </InputGroup>
                            </FormGroup>
                          </div>
                          <div className="col-sm-6">
                            <FormGroup controlId="user" bsSize="large" validationState={this.getValidationState()}>
                              <FormControl
                                type="password"
                                placeholder="Re-type password"
                                name="passwordCheck"
                                value={this.state.passwordCheck}
                                onChange={this.handleChange.bind(this)}
                              />
                              <FormControl.Feedback />
                              <div className="text-center">
                                <HelpBlock><small><em>* Passwords must match</em></small></HelpBlock>
                              </div>
                            </FormGroup>
                          </div>
                        </div>



                        {/* SPAM PROTECTION */}
                        <div className="form-group hidden">
                          <label>Keep this field blank</label>
                          <input
                            type="text"
                            className="form-control"
                            name="honeypot"
                            value={this.state.honeypot} onChange={this.handleChange.bind(this)}
                          />
                        </div>


                        <div className="row btn-actions">
                          <div className="col-sm-12 text-center">
                            <Button
                              bsStyle="primary"
                              type="submit"
                              block
                            >
                              SIGN UP
                            </Button>
                          </div>
                          {/* <div className="col-sm-6">
                            <Button
                              bsStyle="primary"
                              type="button"
                              onClick={() => browserHistory.push('/')}
                              block
                            >
                              Cancel
                            </Button>
                          </div> */}
                        </div>
                      </form>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Login);

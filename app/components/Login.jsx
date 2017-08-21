import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import axios from 'axios';
import {Tabs, Tab, Button, FormGroup, FormControl, Alert, InputGroup, Panel, PageHeader} from 'react-bootstrap';
import superagent from 'superagent';

export class Login extends React.Component {
  constructor(context) {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      loginError: '',
      signupError: ''
    }
  }

  // LOGIN
  handleLogin(event) {
    event.preventDefault();

    const { email, password } = this.state;
    const customer = { email, password };

    axios.post('/api/token', customer)
      .then(() => {
        let profile;

        if (document.cookie) {
          const cookie = document.cookie.split(';');
          const status = cookie[0];
          const access = cookie[1].trim();

          if (access === 'access=admin') {
            profile = '/adminProfile';
          } else if (access === 'access=employee') {
            profile = '/employeeProfile';
          } else if (access === 'access=customer') {
            profile = '/customerProfile';
          } else {
            profile = '/login';
          }
        }

        browserHistory.push(profile);
      })
      .catch((err) => {
        console.log(err);
        this.setState({loginError: err});
      });
  }


  // SIGN UP
  handleSubmit(event) {
    console.log(event);
    event.preventDefault();
    const { firstName, lastName, email, phoneNumber, password } = this.state;
    const newUser = { firstName, lastName, email, phoneNumber, password };

    axios.post('/api/users', newUser)
      .then((res) => {
        console.log(res, '****** res');
        this.setState({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: ''
        });

        browserHistory.push('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  }


  // HANDLE FORM INPUT EVENT CHANGES
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    return (
        <div className="row user-login">
          <div className="col-sm-6 col-sm-offset-3">
            <Panel>
              <div className="row">
                <div className="col-sm-12 text-center">
                  <PageHeader>Login</PageHeader>
                </div>
              </div>

              {/* LOGIN */}
              <Tabs defaultActiveKey={1} id="loginTabs">
                <Tab eventKey={1} title="Log In">
                  <div className="row">
                    <div className="col-sm-10 col-sm-offset-1">
                      <form onSubmit={this.handleLogin.bind(this)}>
                        <FormGroup controlId="email">
                          <InputGroup>
                            <InputGroup.Addon>
                              <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
                            </InputGroup.Addon>
                            <FormControl
                              type="text"
                              bsSize="large"
                              placeholder="example@address.com"
                              name="email"
                              value={this.state.email}
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup controlId="user">
                          <InputGroup>
                            <InputGroup.Addon>
                              <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
                            </InputGroup.Addon>
                            <FormControl
                              type="password"
                              bsSize="large"
                              placeholder="Password"
                              name="password"
                              value={this.state.password}
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>
                        </FormGroup>
                        <div className="row btn-actions">
                          <div className="col-sm-6">
                            <Button
                              bsStyle="primary"
                              type="submit"
                              block
                            >
                              Submit
                            </Button>
                          </div>
                          <div className="col-sm-6">
                            <Button
                              bsStyle="primary"
                              type="button"
                              onClick={() => browserHistory.push('/login')}
                              block
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </form>

                      {/* LOGIN ERROR ALERT */}
                      { this.state.loginError &&
                        <Alert bsStyle="danger">{this.state.loginError}</Alert>
                      }
                    </div>
                  </div>
                </Tab>






                {/* SIGN UP */}
                <Tab eventKey={2} title="Sign Up">
                  <div className="row">
                    <div className="col-sm-10 col-sm-offset-1">
                      <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="row">
                          <div className="col-sm-6">
                            <FormGroup controlId="user">
                              <InputGroup>
                                <InputGroup.Addon>
                                  <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
                                </InputGroup.Addon>
                                <FormControl
                                  type="text"
                                  bsSize="large"
                                  placeholder="First name"
                                  name="firstName"
                                  value={this.state.firstName}
                                  onChange={this.handleChange.bind(this)}
                                />
                              </InputGroup>
                            </FormGroup>
                          </div>
                          <div className="col-sm-6">
                            <FormGroup controlId="user">
                              <FormControl
                                type="text"
                                bsSize="large"
                                placeholder="Last name"
                                name="lastName"
                                value={this.state.lastName}
                                onChange={this.handleChange.bind(this)}
                              />
                            </FormGroup>
                          </div>
                        </div>
                        <FormGroup controlId="user">
                          <InputGroup>
                            <InputGroup.Addon>
                              <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
                            </InputGroup.Addon>
                            <FormControl
                              type="text"
                              bsSize="large"
                              placeholder="Address"
                              name="address"
                              value={this.state.address}
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup controlId="user">
                          <InputGroup>
                            <InputGroup.Addon>
                              <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
                            </InputGroup.Addon>
                            <FormControl
                              type="text"
                              bsSize="large"
                              placeholder="example@address.com"
                              name="email"
                              value={this.state.email}
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup controlId="user">
                          <InputGroup>
                            <InputGroup.Addon>
                              <span className="glyphicon glyphicon-phone" aria-hidden="true"></span>
                            </InputGroup.Addon>
                            <FormControl
                              type="text"
                              bsSize="large"
                              placeholder="(123) 456-7890"
                              name="phoneNumber"
                              value={this.state.phoneNumber}
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup controlId="user">
                          <InputGroup>
                            <InputGroup.Addon>
                              <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
                            </InputGroup.Addon>
                            <FormControl
                              type="password"
                              bsSize="large"
                              placeholder="Password"
                              name="password"
                              value={this.state.password}
                              onChange={this.handleChange.bind(this)}
                            />
                          </InputGroup>
                        </FormGroup>
                        <div className="row btn-actions">
                          <div className="col-sm-6">
                            <Button
                              bsStyle="primary"
                              type="submit"
                              block
                            >
                              Submit
                            </Button>
                          </div>
                          <div className="col-sm-6">
                            <Button
                              bsStyle="primary"
                              type="button"
                              onClick={() => browserHistory.push('/login')}
                              block
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </form>

                      {/* SIGN UP ERROR ALERT */}
                      { this.state.signupError &&
                        <Alert bsStyle="danger">{this.state.signupError}</Alert>
                      }
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Panel>
          </div>
        </div>
    )
  }
}

export default withRouter(Login);

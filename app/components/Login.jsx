import React from 'react';
import { browserHistory, withRouter, Link } from 'react-router';
import axios from 'axios';
import {Tabs, Tab, Button, FormGroup, FormControl, InputGroup, Panel, PageHeader, HelpBlock} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

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
        this.props.setToast('Invalid email or password!', {type: 'error'});
      });
  }


  // SIGN UP
  handleSubmit(event) {
    event.preventDefault();
    const { password, passwordCheck } = this.state;

    if (this.state.honeypot === '' && password === passwordCheck) {
      const { firstName, lastName, address, email, phoneNumber, password } = this.state;
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
        });
    } else {
      console.log('SPAM!!!');
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
              <Tabs defaultActiveKey={1} activeKey={this.state.key} onSelect={this.handleSelect} id="loginTabs">
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
                          <Link to="/forgotPassword">Forgot password?</Link>
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
                              onClick={() => browserHistory.push('/')}
                              block
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </form>
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
                              placeholder="Email"
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



                        <FormGroup controlId="user" validationState={this.getPasswordValidationState()}>
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


                        <FormGroup controlId="user" validationState={this.getValidationState()}>
                          <InputGroup>
                            <InputGroup.Addon>
                              <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
                            </InputGroup.Addon>
                            <FormControl
                              type="password"
                              bsSize="large"
                              placeholder="Retype password"
                              name="passwordCheck"
                              value={this.state.passwordCheck}
                              onChange={this.handleChange.bind(this)}
                            />
                            <FormControl.Feedback />
                          </InputGroup>
                          <HelpBlock>Passwords must match</HelpBlock>
                        </FormGroup>


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
                              onClick={() => browserHistory.push('/')}
                              block
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </form>
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

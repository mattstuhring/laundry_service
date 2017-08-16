import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import axios from 'axios';
import {Tabs, Col, Tab, ButtonToolbar, Button, FormGroup, FormControl, ControlLabel, Alert, InputGroup, Panel} from 'react-bootstrap';
import superagent from 'superagent';

export class Login extends React.Component {
  constructor(context) {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      loginError: '',
      signupError: ''
    }
  }


  handleLogin(event) {
    event.preventDefault();

    const { email, password } = this.state;
    const user = { email, password };

    axios.post('/api/token', user)
      .then(() => {
        browserHistory.push('/profile');
      })
      .catch((err) => {
        console.log(err);
        this.setState({loginError: err})
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('Here at the submit method');
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    return (
        <div className="row login">
          <div className="col-sm-6 col-sm-offset-3">
            <Panel>
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
                              onClick={() => browserHistory.push('/')}
                              block
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </form>
                      { this.state.loginError &&
                        <Alert bsStyle="danger">{this.state.loginError}</Alert>
                      }
                    </div>
                  </div>
                </Tab>

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
                              name="phone"
                              value={this.state.phone}
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
                              onClick={() => browserHistory.push('/')}
                              block
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </form>

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

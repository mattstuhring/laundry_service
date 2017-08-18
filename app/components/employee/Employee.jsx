import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import axios from 'axios';
import {Button, FormGroup, FormControl, Alert, InputGroup, Panel, PageHeader} from 'react-bootstrap';
import superagent from 'superagent';

export class Employees extends React.Component {
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
      <div className="row employee-login">
        <div className="col-sm-6 col-sm-offset-3">
          <Panel>
            <div className="row">
              <div className="col-sm-12 text-center">
                <PageHeader>Employee Login</PageHeader>
              </div>
            </div>
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
                { this.state.loginError &&
                  <Alert bsStyle="danger">{this.state.loginError}</Alert>
                }
              </div>
            </div>
          </Panel>
        </div>
      </div>
    )
  }
}

export default withRouter(Employees);

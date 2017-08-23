import React from 'react'
import { browserHistory, withRouter } from 'react-router';
import axios from 'axios';
import {Button, FormGroup, FormControl, InputGroup, Panel, PageHeader, HelpBlock} from 'react-bootstrap';


export class ForgotPassword extends React.Component {
  constructor(context) {
    super()

    this.state = {
      email: '',
      honeypot: ''
    }
  }


  handleSubmit(event) {
    event.preventDefault();


    if (this.state.honeypot === '') {
      console.log('You are here!');
      const { email } = this.state;

      axios.post('/api/forgotPassword', {email})
        .then((res) => {
          console.log(res, '****** res');
          browserHistory.push('/login')
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

  render() {
    return (
      <div className="row user-login">
        <div className="col-sm-6 col-sm-offset-3">
          <Panel>
            <div className="row">
              <div className="col-sm-12 text-center">
                <PageHeader>Forgot Password</PageHeader>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-8 col-sm-offset-2">
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <FormGroup controlId="email">
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
                        Send
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
              </div>
            </div>
          </Panel>
        </div>
      </div>
    )
  }
}
export default withRouter(ForgotPassword);

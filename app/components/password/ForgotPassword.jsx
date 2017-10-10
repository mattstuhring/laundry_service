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
      const { email } = this.state;

      axios.post('/api/forgotPassword', {email})
        .then((res) => {
          this.props.setToast('A password reset email has been sent to you.', {type: 'success'});
          browserHistory.push('/login')
        })
        .catch((err) => {
          this.props.setToast('Please try again.', {type: 'error'});
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
      <div className="row forgot-password">
        <div className="col-xs-12 col-sm-10 col-sm-offset-1">


          <div className="row forgot-header">
            <div className="col-sm-8 col-sm-offset-2">
              <div className="row">
                <div className="col-sm-12 text-center">
                  <div className="page-header">
                    <h1>PASSWORD <small><em>- Forgot?</em></small></h1>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 text-center">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>



          <div className="row">
            <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3">
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
                  <div className="col-xs-6 col-sm-6">
                    <Button
                      bsStyle="primary"
                      type="submit"
                      block
                    >
                      SEND
                    </Button>
                  </div>
                  <div className="col-xs-6 col-sm-6">
                    <Button
                      bsStyle="primary"
                      type="button"
                      onClick={() => browserHistory.push('/login')}
                      block
                    >
                      GO BACK
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(ForgotPassword);

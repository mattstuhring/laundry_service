import React from 'react'
import { browserHistory, withRouter } from 'react-router';
import axios from 'axios';
import {Button, FormGroup, FormControl, InputGroup, Panel, PageHeader, HelpBlock} from 'react-bootstrap';


export class ResetPassword extends React.Component {
  constructor(context) {
    super()

    this.state = {
      password: '',
      passwordCheck: ''
    }
  }


  handleSubmit(event) {
    event.preventDefault();

    const payload = {
      password: this.state.password,
      token: this.props.location.query.token
    };

    axios.put('/api/resetPassword', payload)
      .then((res) => {
        this.props.setToast('Password reset was a success!', {type: 'success'});
        browserHistory.push('/login');
      })
      .catch((err) => {
        this.props.setToast('Server error!', {type: 'error'});
        console.log(err);
      });
  }

  // HANDLE FORM INPUT EVENT CHANGES
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
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
      <div className="row reset-password">
        <div className="col-xs-12 col-sm-10 col-sm-offset-1">

          <div className="row reset-header">
            <div className="col-sm-8 col-sm-offset-2">
              <div className="row">
                <div className="col-sm-12 text-center">
                  <div className="page-header">
                    <h1>PASSWORD <small><em>- Reset!</em></small></h1>
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
                      placeholder="Re-type password"
                      name="passwordCheck"
                      value={this.state.passwordCheck}
                      onChange={this.handleChange.bind(this)}
                    />
                    <FormControl.Feedback />
                  </InputGroup>
                  <HelpBlock><small><em>* Passwords must match</em></small></HelpBlock>
                </FormGroup>

                <div className="row btn-actions">
                  <div className="col-xs-6 col-sm-6">
                    <Button
                      bsStyle="primary"
                      type="submit"
                      block
                    >
                      SUBMIT
                    </Button>
                  </div>
                  <div className="col-xs-6 col-sm-6">
                    <Button
                      bsStyle="primary"
                      type="button"
                      onClick={() => browserHistory.push('/login')}
                      block
                    >
                      CANCEL
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
export default withRouter(ResetPassword);

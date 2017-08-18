import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import { Button, Panel, PageHeader } from 'react-bootstrap';


export class Login extends React.Component {
  render() {
    return (
      <div className="row login">
        <div className="col-sm-4 col-sm-offset-4">
          <Panel>
            <div className="row">
              <div className="col-sm-12 text-center">
                <PageHeader>Login Portal</PageHeader>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1">
                <Button
                  bsStyle="primary"
                  bsSize="large"
                  onClick={() => {browserHistory.push('/customer')}}
                  block
                >
                  CUSTOMER
                </Button>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 text-center">
                <h4>or</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1">
                <Button
                  bsStyle="warning"
                  bsSize="large"
                  onClick={() => {browserHistory.push('/employee')}}
                  block
                >
                  EMPLOYEE
              </Button>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);

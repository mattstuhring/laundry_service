import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron} from 'react-bootstrap';

class EmployeeProfile extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <Jumbotron>
            <h2>Welcome, <small>Employee</small>!</h2>
          </Jumbotron>
        </div>
      </div>
    )
  }
}

export default withRouter(EmployeeProfile);

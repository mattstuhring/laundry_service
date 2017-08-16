import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron} from 'react-bootstrap';

class Profile extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <Jumbotron>
            <h2>Welcome back, <small>John Doe</small>!</h2>
          </Jumbotron>
        </div>
      </div>
    )
  }
}

export default withRouter(Profile);

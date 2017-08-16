import React from 'react'
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron, Button} from 'react-bootstrap'
import { Link } from 'react-router'

export class Home extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <Jumbotron>
            <h1>Welcome!</h1>
            <h4>NEVER DO LAUNDRY AGAIN</h4>
            <Link to="/login">
              <Button bsStyle="primary">Get Started</Button>
            </Link>
          </Jumbotron>
        </div>
      </div>
    )
  }
}
export default withRouter(Home);

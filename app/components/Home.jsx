import React from 'react'
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron, Button, Image} from 'react-bootstrap';
import { Link } from 'react-router'

export class Home extends React.Component {

  render() {
    return (
      <div className="row home">
        <div className="col-sm-12">
          <div className="welcome">
            <h1>NEVER DO YOUR LAUNDRY AGAIN!</h1>
            <Link to="/login">
              <Button bsStyle="primary" bsSize="large">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Home);

import React from 'react'
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron, Button} from 'react-bootstrap';
import { Link } from 'react-router'

export class Home extends React.Component {

  render() {
    return (
      <div className="row home">
        <div className="col-sm-12">
          <Jumbotron>
            <h2>NEVER DO LAUNDRY AGAIN</h2>
            <Link to="/login">
              <Button bsStyle="primary" bsSize="large">Get Started</Button>
            </Link>
          </Jumbotron>
        </div>
      </div>
    )
  }
}
export default withRouter(Home);

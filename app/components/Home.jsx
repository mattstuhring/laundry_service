import React from 'react'
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron, Button, Image} from 'react-bootstrap';
import { Link } from 'react-router'

export class Home extends React.Component {

  render() {
    return (
      <div className="home">

        {/* HEADER */}
        <div className="row">
          <div className="col-sm-10 col-sm-offset-1">
            <div className="page-header home-header text-center">
              <h1>Laundry Service</h1>
            </div>
          </div>
        </div>

        <div className="row home-img">
          <div className="col-sm-12">
            <div className="welcome">
              <h1>NEVER DO YOUR LAUNDRY AGAIN!</h1>
              <Link to="/login">
                <Button bsStyle="primary" bsSize="large">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Home);

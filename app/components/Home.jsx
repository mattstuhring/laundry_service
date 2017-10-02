import React from 'react'
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron, Button, Image} from 'react-bootstrap';
import { Link } from 'react-router'

export class Home extends React.Component {

  render() {
    return (
      <div className="home">
        <div className="row">
          <div className="welcome">
            <div className="btn-img">
              <Image src="images/home-btn.svg"/>
              {/* <Link to="/login">
                <Button bsStyle="link" bsSize="large">

                </Button>
              </Link> */}
            </div>

            <div className="machine-img">
              <Image src="images/home.svg"/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Home);

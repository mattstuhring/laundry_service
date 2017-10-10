import React from 'react'
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron, Button, Image} from 'react-bootstrap';
import { Link } from 'react-router'

export class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleLink = this.handleLink.bind(this);
  }

  handleLink() {
    browserHistory.push('/login');
  }

  render() {
    return (
      <div className="row home">
        <div className="col-sm-12">
          <div className="welcome">
            <div className="btn-img" onClick={() => {this.handleLink()}}>
              <Image src="images/home-btn.svg"/>
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

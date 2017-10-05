import React from 'react'
import { browserHistory, withRouter } from 'react-router';
import {Button, Image} from 'react-bootstrap';
import { Link } from 'react-router'

export class AdminContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleOrders = this.handleOrders.bind(this);
    this.handleUsers = this.handleUsers.bind(this);
  }

  handleOrders() {
    browserHistory.push('/adminOrders');
  }

  handleUsers() {
    browserHistory.push('/adminUsers');
  }

  render() {
    return (
      <div className="admin-container">
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2">
            <div className="row">
              <div className="col-sm-12">
                <Button onClick={() => {this.handleOrders()}}>ORDERS</Button>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <Button onClick={() => {this.handleUsers()}}>USERS</Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(AdminContainer);

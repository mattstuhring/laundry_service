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
      <div className="row admin-container">
        <div className="col-xs-12 col-sm-12 admin-col">
          <div className="row profile-header">
            <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2">
              <div className="row">
                <div className="col-sm-12 text-center">
                  <i className="fa fa-user-circle" aria-hidden="true"></i>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 text-center">
                  <div className="page-header">
                    <h1>ADMIN<small><em> - Access only</em></small></h1>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2">
            <div className="row">
              <div className="col-xs-12 col-sm-6 text-center orders-btn">

                <Button onClick={() => {this.handleOrders()}}>
                  <div className="row">
                    <div className="col-sm-12">
                      <i className="fa fa-id-card-o" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <em>ORDERS</em>
                    </div>
                  </div>
                </Button>
              </div>

              <div className="col-xs-12 col-sm-6 text-center users-btn">
                <Button onClick={() => {this.handleUsers()}}>
                  <div className="row">
                    <div className="col-sm-12">
                      <i className="fa fa-users" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <em>USERS</em>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(AdminContainer);

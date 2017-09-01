import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import { Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel, Table, Tabs, Tab, Checkbox, Radio } from 'react-bootstrap';
import moment from 'moment';
import Popup from 'Popup';

class AdminProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      orderId: null,
      taskId: null,
      firstName: '',
      orderStep: '',
      queueOrders: [],
      completeOrders: [],
      activeOrders: [],
      customers: [],
      employees: [],
      showModal: false,
      modal: {
        title: '',
        message: '',
        action: null
      }
    }

    this.close = this.close.bind(this);
    this.openAccess = this.openAccess.bind(this);
    this.openActive = this.openActive.bind(this);
    this.openComplete = this.openComplete.bind(this);
    this.openRemoveUser = this.openRemoveUser.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleUserAccess = this.handleUserAccess.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
  }

  componentWillMount() {
    axios.get('/api/authAdmin')
    .then((res) => {
      const data = res.data[0];
      this.setState({firstName: data.firstName});

      return axios.get('/api/users')
        .then((r) => {
          this.setState({ customers: r.data[0], employees: r.data[1]})

          return axios.get('/api/admin')
            .then((res) => {
              this.setState({
                queueOrders: res.data[0],
                completeOrders: res.data[1],
                activeOrders: res.data[2]
              });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      browserHistory.push('/login');
    });
  }


  handleActive() {
    const {orderId, orderStep, taskId } = this.state;
    const check = 'active';

    axios.put('/api/admin', {orderId, check, orderStep, taskId})
      .then((r) => {

        return axios.get('/api/admin')
          .then((res) => {
            console.log(res, '*********** res');

            this.setState({
              showModal: false,
              queueOrders: res.data[0],
              completeOrders: res.data[1],
              activeOrders: res.data[2]
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }


  handleComplete() {
    const { orderId, orderStep } = this.state;

    axios.delete(`/api/admin/${orderId}/${orderStep}`)
      .then((r) => {
        return axios.get('/api/admin')
          .then((res) => {
            this.setState({
              showModal: false,
              queueOrders: res.data[0],
              completeOrders: res.data[1],
              activeOrders: res.data[2]
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleRemoveUser() {
    const { userId } = this.state;

    axios.delete(`/api/users/${userId}`)
      .then(() => {
        return axios.get('/api/users')
          .then((r) => {
            this.setState({
              customers: r.data[0],
              employees: r.data[1],
              showModal: false
            })
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }


  handleUserAccess() {
    const { userId } = this.state;

    axios.put('/api/users', {userId})
      .then((res) => {
        console.log(res, '****** res');

        return axios.get('/api/users')
          .then((r) => {
            this.setState({
              customers: r.data[0],
              employees: r.data[1],
              showModal: false
            })
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }


  close() {
    this.setState({ showModal: false });
  }


  openRemoveUser(id) {
    this.setState({
      showModal: true,
      userId: id,
      modal: {
        title: 'Job:',
        message: 'Warning: You are about to delete this account?',
        action: this.handleRemoveUser
      }
    });
  }

  openActive(oId, status, tId) {
    this.setState({
      showModal: true,
      orderId: oId,
      taskId: tId,
      orderStep: status,
      modal: {
        title: 'Job:',
        message: 'Do you accept this order?',
        action: this.handleActive
      }
    });
  }

  openAccess(id) {
    this.setState({
      showModal: true,
      userId: id,
      orderStep: status,
      modal: {
        title: 'Job:',
        message: 'Granting employee access?',
        action: this.handleUserAccess
      }
    });
  }

  openComplete(id, step) {
    let message;
    if (step === 'Pick-up') {
      message = 'Did you pick up customers laundry?';
    } else if (step === 'Cleaning') {
      message = 'Did you clean the customers laundry?';
    } else if (step === 'Drop-off') {
      message = 'Did you drop-off customers laundry?';
    }

    this.setState({
      showModal: true,
      orderId: id,
      orderStep: step,
      modal: {
        title: 'Job:',
        message: message,
        action: this.handleComplete
      }
    });
  }


  render() {
    return (
      <div className="row employee-profile">
        <div className="col-sm-12">

          {/* MODAL */}
          <Popup
            title={this.state.modal.title}
            message={this.state.modal.message}
            showModal={this.state.showModal}
            close={this.close}
            action={this.state.modal.action}
          />


          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">

              {/* WELCOME HEADER */}
              <div className="page-header">
                <h2>Welcome, <small>Admin</small>!</h2>
              </div>
            </div>
          </div>



          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">

              {/* ALL USERS TABLE */}
              <div className="page-header text-center">
                <h1>Dashboard</h1>
              </div>

              <div className="page-header">
                <h3>Users</h3>
              </div>

              {/* EMPLOYEES TABLE */}
              <h4>Employees:</h4>
              <Table striped bordered condensed hover responsive>
                <thead>
                  <tr className="text-center">
                    <th>#</th>
                    <th>First</th>
                    <th>Last</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Start</th>
                    <th style={{width: '100px'}}>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {this.state.employees.map((e) => {
                    const startDate = moment(e.created_at).format('L');

                    return <tr key={e.id}>
                      <td>{e.id}</td>
                      <td>{e.first_name}</td>
                      <td>{e.last_name}</td>
                      <td>{e.email}</td>
                      <td>{e.phone_number}</td>
                      <td>{startDate}</td>
                      <td className="text-center">
                        <Button
                          bsStyle="danger"
                          bsSize="xsmall"
                          onClick={() => this.openRemoveUser(e.id)}
                        >
                          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </Button>
                      </td>
                    </tr>
                  })}
                </tbody>
              </Table>


              {/* CUSTOMERS TABLE */}
              <h4>Customers:</h4>
              <Table striped bordered condensed hover responsive>
                <thead>
                  <tr className="text-center">
                    <th>#</th>
                    <th>First</th>
                    <th>Last</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Start</th>
                    <th style={{width: '100px'}}>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {this.state.customers.map((c) => {
                    const startDate = moment(c.created_at).format('L');

                    return <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.first_name}</td>
                      <td>{c.last_name}</td>
                      <td>{c.address}</td>
                      <td>{c.email}</td>
                      <td>{c.phone_number}</td>
                      <td>{startDate}</td>
                      <td className="text-center">
                        <Button
                          bsStyle="primary"
                          bsSize="xsmall"
                          onClick={() => this.openAccess(c.id)}
                        >
                          <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
                        </Button>
                        <Button
                          bsStyle="danger"
                          bsSize="xsmall"
                          onClick={() => this.openRemoveUser(c.id)}
                        >
                          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </Button>
                      </td>
                    </tr>
                  })}
                </tbody>
              </Table>





              {/* ALL ORDERS TABLE */}
              <div className="page-header">
                <h3>Orders</h3>
              </div>

              {/* ACTIVE ORDERS */}
              <h4>Active:</h4>
              <Table striped bordered condensed hover responsive>
                <thead>
                  <tr className="text-center">
                    <th>#</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Step</th>
                    <th>Clean</th>
                    <th>Fold</th>
                    <th>Loads</th>
                    <th>Instructions</th>
                    <th style={{width: '100px'}}>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {this.state.activeOrders.map((a) => {
                    const startDate = moment(a.created_at).format('L');
                    let clean, fold;

                    if (a.fold === true) {
                      fold = 'true';
                    } else {
                      fold = 'false'
                    }

                    if (a.clean === true) {
                      clean = 'true';
                    } else {
                      clean = 'false'
                    }

                    return <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{startDate}</td>
                      <td>{a.address}</td>
                      <td>{a.status}</td>
                      <td>{a.step}</td>
                      <td>{clean}</td>
                      <td>{fold}</td>
                      <td>{a.amount}</td>
                      <td>{a.instructions}</td>
                      <td className="text-center">
                        <Button
                          bsStyle="success"
                          bsSize="xsmall"
                          onClick={() => this.openComplete(a.id, a.step)}
                        >
                          <span className="glyphicon glyphicon-check" aria-hidden="true"></span>
                        </Button>
                        <Button
                          bsStyle="danger"
                          bsSize="xsmall"
                          onClick={() => this.openRemoveUser(a.id)}
                        >
                          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </Button>
                      </td>
                    </tr>
                  })}
                </tbody>
              </Table>
            </div>
          </div>


          {/* QUEUE TABLE */}
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">
              <h4>Queue:</h4>
              <Table striped bordered condensed hover responsive>
                <thead>
                  <tr className="text-center">
                    <th>#</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Step</th>
                    <th>Clean</th>
                    <th>Fold</th>
                    <th>Loads</th>
                    <th>Instructions</th>
                    <th style={{width: '100px'}}>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {this.state.queueOrders.map((q) => {
                    const startDate = moment(q.created_at).format('L');
                    let clean, fold;

                    if (q.fold === true) {
                      fold = 'true';
                    } else {
                      fold = 'false'
                    }

                    if (q.clean === true) {
                      clean = 'true';
                    } else {
                      clean = 'false'
                    }

                    return <tr key={q.id}>
                      <td>{q.id}</td>
                      <td>{startDate}</td>
                      <td>{q.address}</td>
                      <td>{q.status}</td>
                      <td>{q.step}</td>
                      <td>{clean}</td>
                      <td>{fold}</td>
                      <td>{q.amount}</td>
                      <td>{q.instructions}</td>
                      <td className="text-center">
                        <Button
                          bsStyle="warning"
                          bsSize="xsmall"
                          onClick={() => this.openActive(q.id, q.step, q.task_id)}
                        >
                          <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                        </Button>
                        <Button
                          bsStyle="danger"
                          bsSize="xsmall"
                          // onClick={() => this.openComplete(a.id, a.step)}
                        >
                          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </Button>
                      </td>
                    </tr>
                  })}
                </tbody>
              </Table>
            </div>
          </div>


          {/* COMPLETE TABLE */}
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">
              <h4>Complete:</h4>
              <Table striped bordered condensed hover responsive>
                <thead>
                  <tr className="text-center">
                    <th>#</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Amount</th>
                    <th>Completed</th>
                    <th style={{width: '100px'}}>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {this.state.completeOrders.map((c) => {
                    const startDate = moment(c.created_at).format('L');
                    const endDate = moment(c.updated_at).format('L');

                    return <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{startDate}</td>
                      <td>{c.address}</td>
                      <td>{c.status}</td>
                      <td>{c.type}</td>
                      <td>{c.amount}</td>
                      <td>{endDate}</td>
                      <td className="text-center">
                        <Button
                          bsStyle="danger"
                          bsSize="xsmall"
                          // onClick={() => this.openComplete(a.id, a.step)}
                        >
                          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </Button>
                      </td>
                    </tr>
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(AdminProfile);

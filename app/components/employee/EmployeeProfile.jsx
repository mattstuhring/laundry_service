import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron, Table, Button} from 'react-bootstrap';
import moment from 'moment';
import Popup from 'Popup';


class EmployeeProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      orderId: null,
      firstName: '',
      queueOrders: [],
      completeOrders: [],
      activeOrders: [],
      showModal: false,
      modal: {
        title: '',
        message: '',
        action: null
      }
    }

    this.close = this.close.bind(this);
    this.openJob = this.openJob.bind(this);
    this.openRemove = this.openRemove.bind(this);
    this.handleActiveJob = this.handleActiveJob.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentWillMount() {
    axios.get('/api/authEmployee')
    .then((res) => {
      const data = res.data[0];
      this.setState({firstName: data.firstName});

      return axios.get(`/api/employeeOrders`)
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
      browserHistory.push('/login');
    });
  }

  handleActiveJob() {
    const {orderId} = this.state;

    axios.put(`/api/employeeOrders`, {orderId})
      .then((res) => {
        console.log(res, '********* res');
        this.setState({ showModal: false, queueOrders: res.data[0], activeOrders: res.data[1] });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleRemove() {
    const {orderId} = this.state;

    axios.delete(`/api/employeeOrders/${orderId}`)
      .then((res) => {
        console.log(res);
        this.setState({ showModal: false, queueOrders: res.data[0], activeOrders: res.data[1] });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  close() {
    this.setState({ showModal: false });
  }


  openJob(id) {
    this.setState({
      showModal: true,
      orderId: id,
      modal: {
        title: 'Job:',
        message: 'Do you accept this order?',
        action: this.handleActiveJob
      }
    });
  }

  openRemove(id) {
    this.setState({
      showModal: true,
      orderId: id,
      modal: {
        title: 'Job:',
        message: 'Remove job from active?',
        action: this.handleRemove
      }
    });
  }


  render() {
    const { firstName } = this.state;

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
                <h2>Welcome, <small>{firstName}</small>!</h2>
              </div>
            </div>
          </div>



          {/* JOBS TABLE */}
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">
              <div className="page-header">
                <h2>Dashboard</h2>
              </div>
              <h4>Active:</h4>
              <Table striped bordered condensed hover>
                <thead className="text-center">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {this.state.activeOrders.map((a) => {
                    const startDate = moment(a.created_at).format('L');

                    return <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{startDate}</td>
                      <td>{a.address}</td>
                      <td>{a.status}</td>
                      <td className="text-center">
                        <Button
                          bsStyle="danger"
                          bsSize="xsmall"
                          onClick={() => this.openRemove(a.id)}
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
              <Table striped bordered condensed hover>
                <thead className="text-center">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {this.state.queueOrders.map((q) => {
                    const startDate = moment(q.created_at).format('L');

                    return <tr key={q.id}>
                      <td>{q.id}</td>
                      <td>{startDate}</td>
                      <td>{q.address}</td>
                      <td>{q.status}</td>
                      <td className="text-center">
                        <Button
                          bsStyle="success"
                          bsSize="xsmall"
                          onClick={() => this.openJob(q.id)}
                        >
                          <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
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
              <Table striped bordered condensed hover>
                <thead className="text-center">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Amount</th>
                    <th>Completed</th>
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

export default withRouter(EmployeeProfile);

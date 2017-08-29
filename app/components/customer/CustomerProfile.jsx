import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import { Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel, Table } from 'react-bootstrap';
import moment from 'moment';
import Popup from 'Popup';

class CustomerProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      orderId: null,
      customer: {
        customerId: null,
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        phoneNumber: '',
      },
      newAddress: '',
      honeypot: '',
      queueOrders: [],
      completeOrders: [],
      showModal: false,
      modal: {
        title: '',
        message: '',
        action: null
      }
    }

    this.handleHome = this.handleHome.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.close = this.close.bind(this);
    this.openHome = this.openHome.bind(this);
    this.openRemove = this.openRemove.bind(this);
    this.openNewAddress = this.openNewAddress.bind(this);
  }


  componentWillMount() {
    axios.get('/api/authCustomer')
    .then((res) => {
      const data = res.data[0];

      this.setState({
        customer: {
          customerId: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          email: data.email,
          phoneNumber: data.phoneNumber
        }
      });

      return axios.get(`/api/customerOrders`)
        .then((res) => {
          this.setState({
            queueOrders: res.data[0],
            completeOrders: res.data[1]
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


  // HOME ORDER BTN -> sets home address as pick up location
  handleHome() {
    const { address } = this.state.customer;

    axios.post('/api/customerOrders', {address})
      .then((res) => {
        const data = res.data;
        let q = Object.assign([], this.state.queueOrders);
        q.unshift(data);

        this.setState({ queueOrders: q, showModal: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }


  // SUBMIT NEW ADDRESS FORM -> sets home address as pick up location
  handleSubmit() {
    const { newAddress } = this.state;

    axios.post('/api/customerOrders', {newAddress})
      .then((res) => {
        const data = res.data;
        let q = Object.assign([], this.state.queueOrders);
        q.unshift(data);

        this.setState({ queueOrders: q, newAddress: '', showModal: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }


  // REMOVE ORDER FROM QUEUE
  handleRemove() {
    const { orderId } = this.state;

    axios.delete(`/api/customerOrders/${orderId}`)
      .then((res) => {
        const data = res.data;
        let q = Object.assign([], this.state.queueOrders);

        for (let i = 0; i < data.length; i++) {
          if (data[i].id === orderId) {
            data.splice(i, 1);
            break;
          }
        }

        this.setState({ queueOrders: data, showModal: false });
      })
      .catch((err) => {
        console.log(err);
      })
  }


  // HANDLE FORM INPUT EVENT CHANGES
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  close() {
    this.setState({ showModal: false });
  }

  openHome() {
    this.setState({
      showModal: true,
      modal: {
        title: 'Submit Order:',
        message: 'Any special instructions?',
        action: this.handleHome
      }
    });
  }

  openNewAddress() {
    this.setState({
      showModal: true,
      modal: {
        title: 'Submit Order:',
        message: 'Any special instructions?',
        action: this.handleSubmit
      }
    });
  }

  openRemove(id) {
    this.setState({
      showModal: true,
      orderId: id,
      modal: {
        title: 'Delete Order:',
        message: 'Are you sure you want to delete this order?',
        action: this.handleRemove
      }
    });
  }


  // ***************************  RENDER  ***************************
  render() {
    const { firstName } = this.state.customer;

    return (
      <div className="row customer-profile">
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
              <div className="row">
                <div className="col-sm-12">

                  {/* WELCOME HEADER */}
                  <div className="page-header">
                    <h2>Welcome, <small>{firstName}</small>!</h2>
                  </div>
                </div>
              </div>

              <Panel>
                <div className="row">
                  <div className="col-sm-12">
                    {/* PAGE HEADER */}
                    <div className="page-header text-center">
                      <h3><em>Where is your laundry?</em></h3>
                    </div>
                  </div>
                </div>

                {/* HOME BTN */}
                <div className="row home-btn">
                  <div className="col-sm-6 col-sm-offset-3">
                    <Button
                      bsStyle="primary"
                      type="button"
                      bsSize="large"
                      block
                      onClick={() => {this.openHome()}}
                    >
                      HOME
                    </Button>
                  </div>
                </div>


                {/* OR */}
                <div className="row">
                  <div className="col-sm-12 text-center">
                    <p>or</p>
                  </div>
                </div>


                {/* NEW ADDRESS FORM */}
                <div className="row">
                  <div className="col-sm-12">
                    <form>
                      <div className="row">
                        <div className="col-sm-8 col-sm-offset-2">
                          <FormGroup controlId="user">
                            <ControlLabel>New Address</ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Address"
                                name="newAddress"
                                value={this.state.newAddress}
                                onChange={this.handleChange.bind(this)}
                              />
                          </FormGroup>
                        </div>
                      </div>

                      {/* SPAM PROTECTION */}
                      <div className="form-group hidden">
                        <label>Keep this field blank</label>
                        <input
                          type="text"
                          className="form-control"
                          name="honeypot"
                          value={this.state.honeypot} onChange={this.handleChange.bind(this)}
                        />
                      </div>
                      <div className="row send-btn">
                        <div className="col-sm-6 col-sm-offset-3">
                          {/* <Button
                            bsStyle="primary"
                            type="submit"
                            bsSize="large"
                            block
                          >
                            SEND
                          </Button> */}
                          <Button
                            bsStyle="primary"
                            type="button"
                            bsSize="large"
                            block
                            onClick={() => {this.openNewAddress()}}
                          >
                            SEND
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </Panel>
            </div>
          </div>


          {/* QUEUE TABLE */}
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">
              <div className="page-header">
                <h2>Laundry Service</h2>
              </div>
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
                          bsStyle="danger"
                          bsSize="xsmall"
                          onClick={() => this.openRemove(q.id)}
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


          {/* COMPLETED TABLE */}
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">
              <h4>Completed:</h4>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Payment</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Completed</th>
                  </tr>
                </thead>
                <tbody>

                  {this.state.completeOrders.map((o) => {
                    const startDate = moment(o.created_at).format('L');
                    const endDate = moment(o.upadated_at).format('L');

                    return <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{startDate}</td>
                      <td>{o.address}</td>
                      <td>{o.type}</td>
                      <td>{o.amount}</td>
                      <td>{o.status}</td>
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

export default withRouter(CustomerProfile);

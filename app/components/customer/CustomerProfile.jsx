import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import {Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel, Table} from 'react-bootstrap';
import moment from 'moment';

class CustomerProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
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
      orders: {
        queue: [],
        complete: []
      }
    }

    this.handleHome = this.handleHome.bind(this);
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

      return axios.get(`/api/orders`)
        .then((res) => {
          console.log(res.data[0], '******* queue');
          console.log(res.data[1], '******* complete');

          this.setState({
            orders: {
              queue: res.data[0],
              complete: res.data[1]
            }
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


  handleHome() {
    const { address } = this.state.customer;

    axios.post('/api/orders', {address})
      .then((res) => {
        const data = res.data;
        let orders = Object.assign([], this.state.orders);
        orders.unshift(data);

        this.setState({ orders });
      })
      .catch((err) => {
        console.log(err);
      });
  }


  handleSubmit(event) {
    event.preventDefault();
  }


  // HANDLE FORM INPUT EVENT CHANGES
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }


  render() {
    const { firstName } = this.state.customer;

    return (
      <div className="row customer-profile">
        <div className="col-sm-12">

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
                      onClick={() => {this.handleHome()}}
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
                    <form onSubmit={this.handleSubmit.bind(this)}>
                      <div className="row">
                        <div className="col-sm-8 col-sm-offset-2">
                          <FormGroup controlId="user">
                            <ControlLabel>New Address</ControlLabel>
                              <FormControl
                                type="text"
                                placeholder="Address"
                                name="address"
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
                          <Button
                            bsStyle="primary"
                            type="submit"
                            bsSize="large"
                            block
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
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {this.state.orders.queue.map((q) => {
                    const startDate = moment(q.created_at).format('L');

                    return <tr key={q.id}>
                      <td>{q.id}</td>
                      <td>{startDate}</td>
                      <td>{q.address}</td>
                      <td>{q.status}</td>
                      <td>
                        <Button
                          bsStyle="danger"
                          bsSize="xsmall"
                          // onClick={() => this.removeProduct(p.productId)}
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

                  {this.state.orders.complete.map((o) => {
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

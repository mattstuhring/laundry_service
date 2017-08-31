import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import { Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel, Table, Tabs, Tab, ProgressBar, Checkbox, Radio } from 'react-bootstrap';
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
      honeypot: '',
      queueOrders: [],
      completeOrders: [],
      showModal: false,
      modal: {
        title: '',
        message: '',
        action: null
      },
      orderAddress: '',
      orderServices: [],
      orderLoads: null,
      orderContact: '',
      orderInstructions: '',
      key: 1
    }

    this.handleRemove = this.handleRemove.bind(this);
    this.handleOrder = this.handleOrder.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.close = this.close.bind(this);
    this.openOrder = this.openOrder.bind(this);
    this.openRemove = this.openRemove.bind(this);
    this.handleBoxChange = this.handleBoxChange.bind(this);
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



  // SUBMIT NEW ORDER FORM
  handleOrder() {
    const { orderAddress, orderServices, orderLoads, orderContact, orderInstructions  } = this.state;
    const newOrder = { orderAddress, orderServices, orderLoads, orderContact, orderInstructions };


    axios.post('/api/customerOrders', {newOrder})
      .then((res) => {
        const data = res.data;
        let q = Object.assign([], this.state.queueOrders);
        q.unshift(data);

        console.log(q, '*********** queue orders');
        this.setState({ queueOrders: q, showModal: false, orderAddress: '', orderServices: [], orderLoads: null, orderContact: '', orderInstructions: '', key: 2 });
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


  openOrder() {
    this.setState({
      showModal: true,
      modal: {
        title: 'Order:',
        message: 'Everything good to go?',
        action: this.handleOrder
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

  handleSelect(key) {
    console.log('selected ' + key);
    this.setState({key});
  }

  handleBoxChange(event) {
    let {orderServices} = this.state;
    let arr = Object.assign([], this.state.orderServices);

    if (orderServices.length > 0) {
      for (let i = 0; i < orderServices.length; i++) {
        if (orderServices[i] === event.target.value) {
          arr.splice(i, 1);
          this.setState({orderServices: arr});

          return;
        }
      }
    }

    arr.push(event.target.value);
    this.setState({orderServices: arr});
  }


  // ***************************  RENDER  ***************************
  render() {
    const { firstName } = this.state.customer;
    const now = 60;

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
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
                  <Tab eventKey={1} title="Schedule Pick-up">

                    {/* NEW ORDER FORM */}
                    <div className="row">
                      <div className="col-sm-12">
                        <form>
                          <div className="row">
                            <div className="col-sm-10 col-sm-offset-1">


                              {/* ADDRESS */}
                              <FormGroup controlId="user">
                                <ControlLabel>Address:</ControlLabel>
                                <FormControl
                                  type="text"
                                  placeholder="Address"
                                  name="orderAddress"
                                  value={this.state.orderAddress}
                                  onChange={this.handleChange.bind(this)}
                                />
                              </FormGroup>


                              {/* SERVICES */}
                              <FormGroup controlId="user">
                                <ControlLabel bsClass="click-input">Services:</ControlLabel>
                                <Checkbox
                                  inline
                                  value={'clean'}
                                  onChange={this.handleBoxChange.bind(this)}
                                >
                                  Wash/Dry
                                </Checkbox>
                                {' '}
                                <Checkbox
                                  inline
                                  value={'fold'}
                                  onChange={this.handleBoxChange.bind(this)}
                                >
                                  Fold
                                </Checkbox>
                              </FormGroup>


                              {/* NUMBER OF LOADS */}
                              <FormGroup controlId="user">
                                <ControlLabel bsClass="click-input">Number of Loads:</ControlLabel>
                                <Radio
                                  name="radioGroup"
                                  inline
                                  name="orderLoads"
                                  value={1}
                                  onChange={this.handleChange.bind(this)}
                                >
                                  1
                                </Radio>
                                {' '}
                                <Radio
                                  name="radioGroup"
                                  inline
                                  name="orderLoads"
                                  value={2}
                                  onChange={this.handleChange.bind(this)}
                                >
                                  2
                                </Radio>
                                {' '}
                                <Radio
                                  name="radioGroup"
                                  inline
                                  name="orderLoads"
                                  value={3}
                                  onChange={this.handleChange.bind(this)}
                                >
                                  3
                                </Radio>
                              </FormGroup>


                              {/* CONTACT */}
                              <FormGroup controlId="user">
                                <ControlLabel>Contact:</ControlLabel>
                                  <FormControl
                                    type="text"
                                    placeholder="How would you like to be contacted?"
                                    name="orderContact"
                                    value={this.state.orderContact}
                                    onChange={this.handleChange.bind(this)}
                                  />
                              </FormGroup>


                              {/* SPECIAL INSTRUCTIONS */}
                              <FormGroup controlId="user">
                                <ControlLabel>Instructions:</ControlLabel>
                                  <FormControl
                                    componentClass="textarea"
                                    type="text"
                                    placeholder="Any special instructions?"
                                    name="orderInstructions"
                                    value={this.state.orderInstructions}
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


                          {/* OREDER BTN */}
                          <div className="row send-btn">
                            <div className="col-sm-6 col-sm-offset-3">
                              <Button
                                bsStyle="primary"
                                type="button"
                                bsSize="large"
                                onClick={() => {this.openOrder()}}
                                block
                              >
                                SEND
                              </Button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Tab>


                  {/* PROGRESS BAR */}
                  <Tab eventKey={2} title="Order Status">
                    {this.state.queueOrders.map((q) => {
                      const startDate = moment(q.created_at).format('L');

                      let step;
                      if (q.status === 'Queue') {
                        step = <ProgressBar striped active active bsStyle="info" now={10} key={1} label={'Queue'} />;
                      } else if (q.step === 'Pick-up') {
                        step = <div><ProgressBar striped active  active bsStyle="info" now={10} key={1} label={'Queue'} /><ProgressBar striped active bsStyle="success" now={30} key={2} label={'Pick-up'}/></div>;
                      } else if (q.step === 'Cleaning') {
                        step = <div><ProgressBar striped active  active bsStyle="info" now={10} key={1} label={'Queue'} />
                        <ProgressBar striped active bsStyle="success" now={30} key={2} label={'Pick-up'}/>
                        <ProgressBar striped active  bsStyle="warning" now={30} key={3} label={'Cleaning'}/></div>;
                      } else if (q.step === 'Drop-off') {
                        step = <div><ProgressBar striped active  active bsStyle="info" now={10} key={1} label={'Queue'} />
                        <ProgressBar striped active bsStyle="success" now={30} key={2} label={'Pick-up'}/>
                        <ProgressBar striped active  bsStyle="warning" now={30} key={3} label={'Cleaning'}/>
                        <ProgressBar striped active  active bsStyle="danger" now={30} key={4} label={'Drop-off'} /></div>;
                      }

                      return <div key={q.id}>
                        <div className="page-header">
                          <p>{'#' + q.id + ' ' + startDate}</p>
                        </div>

                        <ProgressBar>
                          { step }
                        </ProgressBar>

                        {/* <Button
                          bsStyle="danger"
                          bsSize="xsmall"
                          onClick={() => this.openRemove(q.id)}
                        >
                          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </Button> */}

                      </div>
                    })}
                  </Tab>
                </Tabs>
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

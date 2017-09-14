import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import { Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel, Table, Tabs, Tab, ProgressBar, Checkbox, Radio, Breadcrumb, Alert, Pager, Form, Col } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn, InsertButton} from 'react-bootstrap-table';
import moment from 'moment';
import Popup from 'Popup';
import StripeCheckout from 'react-stripe-checkout';
import STRIPE_PUBLISHABLE from '../constants/stripe';



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
      key: 1,
      formKey: 1,
      activeServices: false,
      activeInfo: false,
      activePayment: false,
      alertVisible: false
    }

    this.handleRemove = this.handleRemove.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectKey = this.handleSelectKey.bind(this);
    this.close = this.close.bind(this);
    this.openRemove = this.openRemove.bind(this);
    this.handleBoxChange = this.handleBoxChange.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.onToken = this.onToken.bind(this);
    this.startDateFormatter = this.startDateFormatter.bind(this);
    this.endDateFormatter = this.endDateFormatter.bind(this);
    this.customSearch = this.customSearch.bind(this);

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
              completeOrders: res.data[1],
              activeServices: true
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


  // REMOVE ORDER FROM QUEUE
  handleRemove() {
    const { orderId } = this.state;

    axios.delete(`/api/customerOrders/${orderId}`)
      .then(() => {
        return axios.get(`/api/customerOrders`)
          .then((res) => {
            this.setState({
              showModal: false,
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
      })
  }


  // HANDLE FORM INPUT EVENT CHANGES
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }


  close() {
    this.setState({ showModal: false });
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
    this.setState({key});
  }


  handleSelectKey(key) {
    const { activeServices, activeInfo, activePayment } = this.state;

    if (key === 1) {
      this.setState({formKey: key, activeServices: true, activeInfo: false, activePayment: false});
    } else if (key === 2) {
      this.setState({formKey: key, activeServices: false, activeInfo: true, activePayment: false});
    } else {
      this.setState({formKey: key, activeServices: false, activeInfo: false, activePayment: true});
    }
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




  onToken = (token) => {
    axios.post('/api/charge',
      {
        description: 'Pick-up, clean, & drop-off!',
        source: token.id,
        currency: 'USD',
        amount: 1500
      })
      .then((res) => {
        const { orderAddress, orderServices, orderLoads, orderContact, orderInstructions  } = this.state;
        const newOrder = { orderAddress, orderServices, orderLoads, orderContact, orderInstructions };

        axios.post('/api/customerOrders', {newOrder})
          .then((res) => {
            const data = res.data;
            let q = Object.assign([], this.state.queueOrders);
            q.unshift(data);

            this.setState({ queueOrders: q, showModal: false, orderAddress: '', orderServices: [], orderLoads: null, orderContact: '', orderInstructions: '', key: 2, formKey: 1, alertVisible: true });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        this.props.setToast('Payment declined. Please try again!', {type: 'error'});
      });
  }

  handleAlertDismiss() {
    this.setState({alertVisible: false});
  }


  customSearch = (props) => {
    return (
      <SearchField
        className='my-custom-class'
        defaultValue={ props.defaultSearch }
        placeholder={ props.searchPlaceholder }/>
    );
  }


  startDateFormatter(cell, row) {
    const startDate = moment(row.created_at).format('L');
    return startDate;
  }



  endDateFormatter(cell, row) {
    const endDate = moment(row.created_at).format('L');
    return endDate;
  }



  // ***************************  RENDER  ***************************
  render() {
    const completeOptions = {
      clearSearch: true,
      searchField: this.customSearch
    };

    const { firstName } = this.state.customer;

    const form = () => {
      let {formKey} = this.state;

      if (formKey === 1) {
        return <div>
          <Form horizontal>

            {/* SERVICES */}
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Services:
              </Col>
              <Col sm={9}>
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
              </Col>
            </FormGroup>

            {/* NUMBER OF LOADS */}
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Loads:
              </Col>
              <Col sm={9}>
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
              </Col>
            </FormGroup>

            {/* SPECIAL INSTRUCTIONS */}
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Instructions:
              </Col>
              <Col sm={9}>
                <FormControl
                  componentClass="textarea"
                  type="text"
                  placeholder="Any special instructions?"
                  name="orderInstructions"
                  value={this.state.orderInstructions}
                  onChange={this.handleChange.bind(this)}
                />
              </Col>
            </FormGroup>

            {/* ACTION BTNS */}
            <div className="row">
              <Pager>
                <Pager.Item href="#" next onClick={() => this.handleSelectKey(2)}>Next &rarr;</Pager.Item>
              </Pager>
            </div>
          </Form>
        </div>;
      } else if (formKey === 2) {
        return <div>
          <Form horizontal>
            {/* ADDRESS */}
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Address:
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder="Enter laundry pick-up address."
                  name="orderAddress"
                  value={this.state.orderAddress}
                  onChange={this.handleChange.bind(this)}
                />
              </Col>
            </FormGroup>


            {/* CONTACT */}
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Contact:
              </Col>
              <Col sm={9}>
                <FormControl
                  type="text"
                  placeholder="Number to be contacted at?"
                  name="orderContact"
                  value={this.state.orderContact}
                  onChange={this.handleChange.bind(this)}
                />
              </Col>
            </FormGroup>


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

            {/* ACTION BTNS */}
            <div className="row">
              <Pager>
                <Pager.Item href="#" previous onClick={() => this.handleSelectKey(1)}>&larr; Back</Pager.Item>
                {' '}
                <Pager.Item href="#" next onClick={() => this.handleSelectKey(3)}>Next &rarr;</Pager.Item>
              </Pager>
            </div>
          </Form>
        </div>;
      } else if (formKey === 3) {
        return <div>

          {/* PAYMENT */}
          <div className="row">
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-12 text-center">
                  <h2>Total: $15.00</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-8 col-sm-offset-2">
                  <ul className="payment">
                    <li>
                      We offer free pick up and delivery for UW students Monday through Friday, 9am-5pm.
                    </li>
                    <li>
                      We'll pick up your laundry and bring it back within 48 hours.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              {/* ACTION BTNS */}
              <Pager>
                <Pager.Item href="#" previous onClick={() => this.handleSelectKey(2)}>&larr; Back</Pager.Item>
                {' '}
                <Pager.Item href="#" next onClick={() => this.handleSelectKey(3)}>
                  {/* STRIPE PAYMENT BTN */}
                  <StripeCheckout
                    name="Laundry Service"
                    description="Pick-up, clean, & drop-off!"
                    amount={1500}
                    token={this.onToken}
                    currency="USD"
                    stripeKey={STRIPE_PUBLISHABLE}
                  />
                </Pager.Item>
              </Pager>
            </div>
          </div>
        </div>;
      }
    }

    // SUCCESS PAYMENT ALERT
    const alert = () => {
      if (this.state.alertVisible) {
        return <Alert bsStyle="success" onDismiss={this.handleAlertDismiss}>
          <h4>Your Payment was a success!</h4>
          <p>Check the progress bar below to track your order.</p>
        </Alert>;
      }
    };

    const dashboard = (
      <h3>Welcome, <small>{firstName}</small></h3>
    );


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
            <div className="col-sm-8 col-sm-offset-2">

              <Panel header={dashboard} bsStyle="primary">
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">


                  {/* NEW LAUNDRY ORDER FORM */}
                  <Tab eventKey={1} title="Schedule Pick-up">
                    <div className="row">
                      <div className="col-sm-12">

                        <div className="row">
                          <div className="col-sm-10 col-sm-offset-1">
                            <Breadcrumb>
                              <Breadcrumb.Item href="#" onClick={() => {this.handleSelectKey(1)}} active={this.state.activeServices}>
                                Services
                              </Breadcrumb.Item>
                              <Breadcrumb.Item href="#" onClick={() => {this.handleSelectKey(2)}} active={this.state.activeInfo}>
                                Info
                              </Breadcrumb.Item>
                              <Breadcrumb.Item href="#" onClick={() => {this.handleSelectKey(3)}} active={this.state.activePayment}>
                                Payment
                              </Breadcrumb.Item>
                            </Breadcrumb>

                            {form()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>


                  {/* PROGRESS BAR */}
                  <Tab eventKey={2} title="Order Status">

                    {/* SUCCESS PAYMENT ALERT */}
                    {alert()}

                    {this.state.queueOrders.map((q) => {
                      const startDate = moment(q.created_at).format('L');
                      let step;

                      if (q.step === 'Queue') {
                        step = <ProgressBar striped active active bsStyle="info" now={10} key={1} label={'Queue'} />;
                      } else if (q.step === 'Pick-up') {
                        step = <ProgressBar><ProgressBar striped active  active bsStyle="info" now={10} key={1} label={'Queue'} /><ProgressBar striped active bsStyle="success" now={30} key={2} label={'Pick-up'}/></ProgressBar>;
                      } else if (q.step === 'Cleaning') {
                        step = <ProgressBar><ProgressBar striped active  active bsStyle="info" now={10} key={1} label={'Queue'} />
                        <ProgressBar striped active bsStyle="success" now={30} key={2} label={'Pick-up'}/>
                        <ProgressBar striped active  bsStyle="warning" now={30} key={3} label={'Cleaning'}/></ProgressBar>;
                      } else if (q.step === 'Drop-off') {
                        step = <ProgressBar><ProgressBar striped active  active bsStyle="info" now={10} key={1} label={'Queue'} />
                        <ProgressBar striped active bsStyle="success" now={30} key={2} label={'Pick-up'}/>
                        <ProgressBar striped active  bsStyle="warning" now={30} key={3} label={'Cleaning'}/>
                        <ProgressBar striped active  active bsStyle="danger" now={30} key={4} label={'Drop-off'} /></ProgressBar>;
                      }

                      return <div key={q.id}>
                        <div className="page-header">
                          <p>{'#' + q.id + ' ' + startDate}</p>
                        </div>

                        {/* PROGRESS BAR */}
                        <div>
                          { step }
                        </div>

                        {/* <Button
                          bsStyle="link"
                          onClick={() => this.openRemove(q.id)}
                        >
                          Cancel
                        </Button> */}

                      </div>
                    })}
                  </Tab>

                  <Tab eventKey={3} title="Complete">
                    <div className="row">
                      <div className="col-sm-12">
                        <h4>Completed:</h4>


                        {/* COMPLETE TABLE */}
                        <BootstrapTable ref="completeTable" striped condensed
                          options={ completeOptions }
                          bordered={ false }
                          data={ this.state.completeOrders }
                          bodyContainerClass='table-body-container'
                          pagination
                          search
                        >
                          <TableHeaderColumn
                            dataField='id'
                            isKey
                            width='50px'
                          >#</TableHeaderColumn>
                          <TableHeaderColumn
                            dataField='created_at'
                            dataFormat={ this.startDateFormatter }
                            width='100px'
                          >Date</TableHeaderColumn>
                          <TableHeaderColumn
                            dataField='address'
                          >Address</TableHeaderColumn>
                          <TableHeaderColumn
                            dataField='status'
                            width='60px'
                          >Status</TableHeaderColumn>
                          <TableHeaderColumn
                            dataField='step'
                            width='60px'
                          >Step</TableHeaderColumn>
                          <TableHeaderColumn
                            dataField='clean'
                            width='60px'
                          >Clean</TableHeaderColumn>
                          <TableHeaderColumn
                            dataField='fold'
                            width='60px'
                          >Fold</TableHeaderColumn>
                          <TableHeaderColumn
                            dataField='amount'
                            width='60px'
                          >Loads</TableHeaderColumn>
                          <TableHeaderColumn
                            dataField='instructions'
                          >Instructions</TableHeaderColumn>
                          <TableHeaderColumn
                            dataField='updated_at'
                            dataFormat={ this.endDateFormatter }
                          >Complete</TableHeaderColumn>
                        </BootstrapTable>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CustomerProfile);

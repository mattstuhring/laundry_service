import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import { Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel, Table, Tabs, Tab, ProgressBar, Checkbox, Radio, Breadcrumb, Alert, Pager, Form, Col, Row, HelpBlock, Popover, Overlay, OverlayTrigger, ButtonToolbar, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, InsertButton } from 'react-bootstrap-table';
import moment from 'moment';
import Popup from 'Popup';
import StripeCheckout from 'react-stripe-checkout';
import STRIPE_PUBLISHABLE from '../constants/stripe';



class CustomerProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      orderId: null,
      customerId: null,
      customerFirstName: '',
      customerLastName: '',
      customerAddress: '',
      customerEmail: '',
      customerPhoneNumber: '',
      honeypot: '',
      queueOrders: [],
      completeOrders: [],
      showModal: false,
      showInstructionsModal: false,
      modal: {
        title: '',
        message: '',
        action: null
      },
      orderAddress: '',
      orderServices: [],
      orderLoads: 0,
      selectedLoadsOption: false,
      selectedServiceClean: false,
      selectedServiceFold: false,
      orderInstructions: '',
      orderPickupDate: moment().format('MM-DD-YYYY'),
      orderPickupTime: '',
      orderTotalCost: 0,
      orderServiceCost: 0,
      key: 1,
      formKey: 1,
      activeServices: false,
      activeInfo: false,
      activePayment: false,
      alertVisible: false,
      show: true
    }

    this.handleRemove = this.handleRemove.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectKey = this.handleSelectKey.bind(this);
    this.close = this.close.bind(this);
    this.closeInstructions = this.closeInstructions.bind(this);
    this.openInstructions = this.openInstructions.bind(this);
    this.openRemove = this.openRemove.bind(this);
    this.handleBoxChange = this.handleBoxChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.onToken = this.onToken.bind(this);
    this.startDateFormatter = this.startDateFormatter.bind(this);
    this.endDateFormatter = this.endDateFormatter.bind(this);
    this.customSearch = this.customSearch.bind(this);
    this.handleTotalCost = this.handleTotalCost.bind(this);
    this.isExpandableRow = this.isExpandableRow.bind(this);
    this.expandCompleteComponent = this.expandCompleteComponent.bind(this);
    this.textareaValidationState = this.textareaValidationState.bind(this);
    this.buttonCompleteFormatter = this.buttonCompleteFormatter.bind(this);
    this.cleanFormatter = this.cleanFormatter.bind(this);
    this.foldFormatter = this.foldFormatter.bind(this);
    this.trClassFormat = this.trClassFormat.bind(this);
  }


  componentWillMount() {
    axios.get('/api/authCustomer')
      .then((res) => {
        const data = res.data[0];

        this.setState({
          customerId: data.id,
          customerFirstName: data.firstName,
          customerLastName: data.lastName,
          customerAddress: data.address,
          customerEmail: data.email,
          customerPhoneNumber: data.phoneNumber
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


  // HANDLE INPUT EVENT CHANGES
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleDateChange(date) {
    this.setState({ orderPickupDate: date });
  }


  handleTimeChange(event) {
    let time = event.target.value

    this.setState({ orderPickupTime: time });
  }


  handleSelect(key) {
    this.setState({ key });
  }


  handleRadioChange(changeEvent) {
    let num = parseInt(changeEvent.target.value);
    this.setState({ orderLoads: num, selectedLoadsOption: num });
  }



  handleBoxChange(event) {
    let servs = event.target.value.split(',');
    let servName = servs[0];
    let servAmount = parseInt(servs[1]);
    let { orderServices } = this.state;
    let arr = Object.assign([], this.state.orderServices);

    if (event.target.checked) {
      arr.push(servName)

      if (servName === 'clean') {
        this.setState({ selectedServiceClean: true, orderServices: arr, orderServiceCost: this.state.orderServiceCost + servAmount });
      } else if (servName === 'fold') {
        this.setState({ selectedServiceFold: true, orderServices: arr, orderServiceCost: this.state.orderServiceCost + servAmount });
      }

    }
    else {
      const index = arr.indexOf(servName);
      arr.splice(index, 1);

      if (servName === 'clean') {
        this.setState({ selectedServiceClean: false, orderServices: arr, orderServiceCost: this.state.orderServiceCost - servAmount });
      } else if (servName === 'fold') {
        this.setState({ selectedServiceFold: false, orderServices: arr, orderServiceCost: this.state.orderServiceCost - servAmount });
      }
    }
  }



  handleTotalCost(key) {
    const { activeServices, activeInfo, activePayment, orderServiceCost, orderLoads } = this.state;

    if (this.state.orderServices.length <= 0 || this.state.orderLoads === 0 || this.state.orderInstructions.length > 90) {
      this.props.setToast('Please check the form & try agian.', {type: 'error'});

      return;
    }

    if (key === 1) {
      this.setState({
        formKey: key,
        activeServices: true,
        activeInfo: false,
        activePayment: false,
        orderTotalCost: orderServiceCost * orderLoads
      });
    } else if (key === 2) {
      this.setState({formKey: key, activeServices: false, activeInfo: true, activePayment: false, orderTotalCost: orderServiceCost * orderLoads});
    } else {
      this.setState({formKey: key, activeServices: false, activeInfo: false, activePayment: true, orderTotalCost: orderServiceCost * orderLoads});
    }
  }




  handleSelectKey(key) {
    const { activeServices, activeInfo, activePayment, customerAddress, customerPhoneNumber, orderPickupTime, orderServices, orderLoads, orderInstructions } = this.state;

    if (key === 1) {
      this.setState({formKey: key, activeServices: true, activeInfo: false, activePayment: false});
    }
    else if (key === 2) {
      if (orderServices.length <= 0 || orderLoads === 0 || orderInstructions.length > 90) {
        this.props.setToast('Please check the form & try agian.', {type: 'error'});

        return;
      }

      this.setState({formKey: key, activeServices: false, activeInfo: true, activePayment: false});
    }
    else if (key === 3) {















































      if (orderPickupTime !== '') {
        // get moments
        let scheduleTime = moment(this.state.orderPickupTime, 'hh:mm A');
        let now = moment().format('hh:mm A');
        scheduleTime = moment(scheduleTime, "hh:mm A");
        now = moment(now, "hh:mm A");
        let lastCall = moment('05:01 PM', 'hh:mm A');

        let diffLastNow = lastCall.diff(now);

        // if passed 05:01 PM
        if (diffLastNow < 0) {
          // today
          const today = moment();

          // tomorrow
          let tomorrow = today.add('days', 1);
          // tomorrow formatted
          tomorrow = moment(tomorrow).format('MM-DD-YYYY');

          this.setState({ orderPickupDate: tomorrow, orderPickupTime: scheduleTime});
        } else {
          // calculate the duration
          const d = moment.duration(scheduleTime.diff(now)).asMilliseconds();

          // convert milliseconds to minutes
          const min = d / 60000;

          if (min < 30) {
            this.props.setToast('Please choose a later pick-up time.', {type: 'error'});
            return;
          }
        }
      }

      if (customerAddress === '' || customerPhoneNumber === '' || orderPickupTime === '') {
        this.props.setToast('Please check the form & try agian.', {type: 'error'});
        return;
      }

      this.setState({formKey: key, activeServices: false, activeInfo: false, activePayment: true});
    }
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



  // STRIPE PAYMENT $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  onToken = (token) => {
    axios.post('/api/charge',
      {
        description: 'Pick-up, clean, & drop-off!',
        source: token.id,
        currency: 'USD',
        amount: this.state.orderTotalCost * 100
      })
      .then((res) => {
        const { customerEmail, customerAddress, orderServices, orderLoads, customerPhoneNumber, orderInstructions, orderTotalCost, orderPickupTime } = this.state;

        let orderPickupDate = this.state;
        orderPickupDate = moment(orderPickupDate).format('L');

        const newOrder = { customerEmail, customerAddress, orderServices, orderLoads, customerPhoneNumber, orderInstructions, orderPickupDate, orderTotalCost, orderPickupTime };

        axios.post('/api/customerOrders', { newOrder })
          .then((res) => {
            const data = res.data;
            let q = Object.assign([], this.state.queueOrders);
            q.unshift(data);

            this.setState({
              queueOrders: q,
              showModal: false,
              customerAddress: this.state.customerAddress,
              orderServices: [],
              orderLoads: 0,
              customerPhoneNumber: this.state.customerPhoneNumber,
              orderInstructions: '',
              orderPickupDate: moment().format('MM-DD-YYYY'),
              orderTotalCost: 0,
              orderServiceCost: 0,
              orderPickupTime: '',
              key: 2,
              formKey: 1,
              alertVisible: true,
              selectedServiceClean: false,
              selectedServiceFold: false,
              selectedLoadsOption: false
            });

            return axios.post('/api/notify', { newOrder, orderId: data.id })
              .then((r) => {
                console.log(r, '************* notify res');
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
        this.props.setToast('Payment declined. Please try again!', {type: 'error'});
      });
  }



  buttonCompleteFormatter(cell, row){
    return (
      <Button
        bsStyle="link"
        onClick={ ()=> this.expandCompleteComponent(row)}
      >
        Details
      </Button>
    );
  }



  handleAlertDismiss() {
    this.setState({ alertVisible: false });
  }


  close() {
    this.setState({ showModal: false });
  }

  closeInstructions() {
    this.setState({ showInstructionsModal: false });
  }

  openInstructions() {
    this.setState({ showInstructionsModal: true });
  }


  cleanFormatter(cell, row) {
    if (row.clean) {
      return ( <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> );
    } else {
      return ( <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> );
    }
  }


  foldFormatter(cell, row) {
    if (row.fold) {
      return ( <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> );
    } else {
      return ( <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> );
    }
  }


  customSearch = (props) => {
    return (
      <SearchField
        className='my-custom-class'
        defaultValue={ props.defaultSearch }
        placeholder={ props.searchPlaceholder }/>
    );
  }

  trClassFormat(row, rowIndex) {
    // row is the current row data
    return rowIndex % 2 === 0 ? "tr-odd" : "tr-even"; // return class name.
  }


  startDateFormatter(cell, row) {
    const startDate = moment(row.created_at).format('L');
    return startDate;
  }



  endDateFormatter(cell, row) {
    const endDate = moment(row.created_at).format('L');
    return endDate;
  }


  textareaValidationState() {
    const length = this.state.orderInstructions.length;

    if (length === 0) {
      return;
    } else if (length <= 90) {
      return 'success';
    } else if (length > 90) {
      return 'error';
    }
  }

  isExpandableRow(row) {
    if (row.id) {
      return true;
    } else {
      return false;
    }
  }


  expandCompleteComponent(row) {
    return (
      <div className="expand-row">
        <BootstrapTable data={ [row] }>
          <TableHeaderColumn
            isKey={ true }
            dataField='amount'
            width='60px'
            dataAlign='center'
          >Loads</TableHeaderColumn>
          <TableHeaderColumn
            dataField='clean'
            width='90px'
            dataAlign='center'
            dataFormat={this.cleanFormatter}
          >Wash/Dry</TableHeaderColumn>
          <TableHeaderColumn
            dataField='fold'
            width='50px'
            dataAlign='center'
            dataFormat={this.foldFormatter}
          >Fold</TableHeaderColumn>
          <TableHeaderColumn
            dataField='instructions'
            dataAlign='center'
            tdStyle={ { whiteSpace: 'normal' } }
          >Instructions</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }








  // ***************************  RENDER  ***************************
  render() {
    const { customerFirstName } = this.state;

    const completeOptions = {
      insertBtn: this.completeButtons,
      clearSearch: true,
      searchField: this.customSearch,
      expandBy: 'column',
      expandRowBgColor: '#337ab7'
    };

    const selectCompleteRow = {
      clickToExpand: true
    };

    const services = () => {
      let { orderServices } = this.state;
      orderServices = orderServices.sort();
      let serv = '';

      if (orderServices.includes('clean') && orderServices.includes('fold')) {
        serv = 'WASH / DRY / FOLD';
      } else if (orderServices.includes('clean')) {
        serv = 'WASH / DRY';
      } else if (orderServices.includes('fold')) {
        serv = 'FOLD';
      } else {
        serv = 'No laundry services have been selected!';
      }

      return serv;
    }


    const checkDate = () => {
      // get moments
      let future = moment(this.state.orderPickupTime, 'hh:mm A');
      const now = moment().format('hh:mm A');
      const end = moment(future, "hh:mm A");
      const start = moment(now, "hh:mm A");
      let lastCall = moment('05:01 PM', 'hh:mm A');

      // if "now" time is a 30min passed 05:01 PM
      // set order pick-up date to tomorrows date
      let time = lastCall.diff(start);

      if (time < 0) {
        const today = moment();
        let tomorrow = today.add('days', 1);
        tomorrow = moment(tomorrow).format('MM-DD-YYYY');

        return <span>
          <FormControl
            type="text"
            value={tomorrow}
            disabled
            className="text-center"
          />
          <div className="text-center">
            <HelpBlock>* Tomorrow's date</HelpBlock>
          </div>
        </span>;
      } else {
        return <span>
          <FormControl
            type="text"
            value={this.state.orderPickupDate}
            disabled
            className="text-center"
          />
          <div className="text-center">
            <HelpBlock>* Today's date</HelpBlock>
          </div>
        </span>;
      }
    }



    const getOrderInstructions = () => {
      if (this.state.orderInstructions !== '') {
        return <div>
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1 order-divider">
            </div>
          </div>
          <div className="row">
            <div className="col-sm-4 text-center">
              <i className="fa fa-envelope-o" aria-hidden="true"></i>
            </div>
            <div className="col-sm-8 text-center">
              <strong>
                <p><em><Button onClick={() => {this.openInstructions()}} bsStyle="link">Instructions</Button></em></p>
              </strong>
            </div>
          </div>
        </div>;
      }
    }




    const form = () => {
      let {formKey} = this.state;

      if (formKey === 1) {
        return <div className="order-services">
          <Form horizontal>

            {/* SERVICES */}
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Services:
              </Col>
              <Col sm={9}>
                <Checkbox
                  inline
                  value={['clean', 5]}
                  onChange={this.handleBoxChange.bind(this)}
                  checked={this.state.selectedServiceClean}
                >
                  Wash/Dry ($5)
                </Checkbox>
                {' '}
                <Checkbox
                  inline
                  value={['fold', 5]}
                  onChange={this.handleBoxChange.bind(this)}
                  checked={this.state.selectedServiceFold}
                >
                  Fold ($5)
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
                  onChange={this.handleRadioChange.bind(this)}
                  checked={this.state.selectedLoadsOption === 1}
                >
                  1
                </Radio>
                {' '}
                <Radio
                  name="radioGroup"
                  inline
                  name="orderLoads"
                  value={2}
                  onChange={this.handleRadioChange.bind(this)}
                  checked={this.state.selectedLoadsOption === 2}
                >
                  2
                </Radio>
                {' '}
                <Radio
                  name="radioGroup"
                  inline
                  name="orderLoads"
                  value={3}
                  onChange={this.handleRadioChange.bind(this)}
                  checked={this.state.selectedLoadsOption === 3}
                >
                  3
                </Radio>
              </Col>
            </FormGroup>

            {/* INSTRUCTIONS */}
            <FormGroup validationState={this.textareaValidationState()}>
              <Col componentClass={ControlLabel} sm={3}>
                Optional:
              </Col>
              <Col sm={8}>
                <FormControl
                  componentClass="textarea"
                  type="text"
                  placeholder="Any special instructions?"
                  name="orderInstructions"
                  value={this.state.orderInstructions}
                  onChange={this.handleChange.bind(this)}
                />
                <HelpBlock>90 character max.</HelpBlock>
              </Col>
            </FormGroup>

            {/* ACTION BTNS */}
            <div className="row">
              <div className="col-sm-11">
                <Pager>
                  <Pager.Item href="#" next onClick={() => this.handleTotalCost(2)}>Next &rarr;</Pager.Item>
                </Pager>
              </div>
            </div>
          </Form>
        </div>;
      } else if (formKey === 2) {
        return <div>
          <Form>
            {/* ADDRESS */}
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1">
                <FormGroup>
                  <ControlLabel>Address:</ControlLabel>
                  <FormControl
                    type="text"
                    placeholder={this.state.customerAddress}
                    name="customerAddress"
                    value={this.state.customerAddress}
                    onChange={this.handleChange.bind(this)}
                  />
                </FormGroup>
              </div>
            </div>


            {/* CONTACT */}
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1">
                <FormGroup>
                  <ControlLabel>Contact:</ControlLabel>
                  <FormControl
                    type="text"
                    placeholder={this.state.customerPhoneNumber}
                    name="customerPhoneNumber"
                    value={this.state.customerPhoneNumber}
                    onChange={this.handleChange.bind(this)}
                  />
                </FormGroup>
              </div>
            </div>

            {/* DATE & TIME */}
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1 order-date-time">
                <ControlLabel>Pick-up date & time:</ControlLabel>
                <FormGroup>
                  <div className="col-sm-6 order-date">

                    {checkDate()}

                  </div>
                  <div className="col-sm-6 order-time">
                    <FormControl
                      placeholder="Select time"
                      componentClass="select"
                      onChange={this.handleTimeChange}
                      value={this.state.orderPickupTime}
                    >
                      <option>Select time</option>
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="08:30 AM">08:30 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="09:30 AM">09:30 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </FormControl>
                    <div className="text-center">
                      <HelpBlock>* Allow at least 30min</HelpBlock>
                    </div>
                  </div>
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


            {/* ACTION BTNS */}
            <div className="row">
              <Pager>
                <div className="col-sm-5 col-sm-offset-1">
                  <Pager.Item href="#" previous onClick={() => this.handleSelectKey(1)}>&larr; Back</Pager.Item>
                </div>
                <div className="col-sm-5">
                  <Pager.Item href="#" next onClick={() => this.handleSelectKey(3)}>Next &rarr;</Pager.Item>
                </div>
              </Pager>
            </div>
          </Form>
        </div>;
      } else if (formKey === 3) {
        return <div className="order-payment">

          {/* PAYMENT */}
          <div className="row">
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-6 col-sm-offset-3 text-center">
                  <div className="page-header">
                    <h1><strong>Summary</strong></h1>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-10 col-sm-offset-1">
                  <div className="order-summary">
                    <Panel>
                      <div className="row">
                        <div className="col-sm-4 text-center">
                          <span>
                            <i className="fa fa-calendar" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="col-sm-8 text-center">
                          <p><strong>{this.state.orderPickupDate}</strong></p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-10 col-sm-offset-1 order-divider">
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-4 text-center">
                          <span>
                            <i className="fa fa-clock-o" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="col-sm-8 text-center">
                          <p><strong>{this.state.orderPickupTime}</strong></p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-10 col-sm-offset-1 order-divider">
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-4 text-center">
                          <i className="fa fa-check-square-o" aria-hidden="true"></i>
                        </div>
                        <div className="col-sm-8 text-center">
                          <strong>
                            <p>{services()}</p>
                          </strong>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-10 col-sm-offset-1 order-divider">
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-4 text-center">
                          <img className="order-load-img" src="images/load.svg" />
                        </div>
                        <div className="col-sm-8 text-center">
                          <strong>
                            <p>{this.state.orderLoads}</p>
                          </strong>
                        </div>
                      </div>

                      {getOrderInstructions()}

                      <div className="total-stripe-box">
                        <div className="row order-total">
                          <div className="col-sm-12 text-center">
                            <strong>
                              <h4>Total: ${this.state.orderTotalCost}</h4>
                            </strong>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-12 text-center">
                            {/* STRIPE PAYMENT BTN */}
                            <StripeCheckout
                              name="Laundry Service"
                              description="Pick-up, clean, & drop-off!"
                              amount={this.state.orderTotalCost * 100}
                              token={this.onToken}
                              currency="USD"
                              stripeKey={STRIPE_PUBLISHABLE}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-12 text-center">
                            <img src="images/powered_by_stripe.svg"/>
                          </div>
                        </div>
                      </div>
                    </Panel>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">
              {/* ACTION BTNS */}
              <Pager>
                <Pager.Item href="#" previous onClick={() => this.handleSelectKey(2)}>&larr; Back</Pager.Item>
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
      <h3>Welcome, <small>{customerFirstName}</small></h3>
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

          <Modal show={this.state.showInstructionsModal} onHide={this.closeInstructions}>
            <Modal.Header closeButton>
              <Modal.Title>Instructions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{this.state.orderInstructions}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeInstructions}>Close</Button>
            </Modal.Footer>
          </Modal>

          <div className="row welcome-customer">
            <div className="col-sm-10 col-sm-offset-1">

              <Panel header={dashboard} bsStyle="primary">

                <div className="row welcome-order-form">
                  <div className="col-sm-10 col-sm-offset-1">
                    <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">


                      {/* TAB 1 -> ORDER FORM */}
                      <Tab eventKey={1} title="Schedule Pick-up">
                        <div className="row">
                          <div className="col-sm-12 order-form-panel">
                            <Panel>
                              <Breadcrumb>
                                <Breadcrumb.Item href="#" onClick={() => {this.handleSelectKey(1)}} active={this.state.activeServices}>
                                  Services
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="#" onClick={() => {this.handleTotalCost(2)}} active={this.state.activeInfo}>
                                  Info
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="#" onClick={() => {this.handleSelectKey(3)}} active={this.state.activePayment}>
                                  Payment
                                </Breadcrumb.Item>
                              </Breadcrumb>


                              {/* NEW ORDER FORM */}
                              {form()}
                            </Panel>
                          </div>
                        </div>
                      </Tab>


                      {/* TAB 2 -> ORDER STATUS */}
                      <Tab eventKey={2} title="Order Status">
                        <div className="row">
                          <div className="col-sm-12">
                            {/* SUCCESS PAYMENT ALERT */}
                            {alert()}

                            {this.state.queueOrders.map((q) => {

                              const startDate = moment(q.created_at).format('L');
                              let step;
                              let employee = {};

                              if (q.step === 'Queue') {
                                step = (
                                  <div>
                                    <ProgressBar>
                                      <ProgressBar striped active now={10} key={1} label={'Queue'} onClick={this.handleClick} />
                                      <ProgressBar bsStyle="info" striped active now={30} key={2} label={'Pick-up'}/>
                                      <ProgressBar bsStyle="info" striped active now={30} key={3} label={'Cleaning'}/>
                                      <ProgressBar bsStyle="info" striped active now={30} key={4} label={'Drop-off'} />
                                    </ProgressBar>
                                    <div className="row popover-info">
                                      <div className="col-sm-12">
                                        <div className="arrow-up-lightblue"></div>
                                        <Panel header="Received order!" bsStyle="info">
                                          <div className="queue-font-color">
                                            <p>Laundry pick-up scheduled today, <strong>{startDate}</strong>, at <strong>{q.time}</strong>.</p>
                                            <p>Pick-up location: <strong>{q.address}</strong></p>
                                          </div>
                                        </Panel>
                                      </div>
                                    </div>
                                  </div>);
                              } else if (q.step === 'Pick-up') {
                                step = <div>
                                  <ProgressBar>
                                    <ProgressBar striped active now={10} key={1} label={'Queue'} />
                                    <ProgressBar striped active bsStyle="success" now={30} key={2} label={'Pick-up'}/>
                                    <ProgressBar bsStyle="info" striped active now={30} key={3} label={'Cleaning'}/>
                                    <ProgressBar bsStyle="info" striped active now={30} key={4} label={'Drop-off'} />
                                  </ProgressBar>
                                  <div className="row popover-info">
                                    <div className="col-sm-12">
                                      <div className="arrow-up-green"></div>
                                      <Panel header="Pick-up in route!" bsStyle="success">
                                        <div className="pickup-font-color">
                                          <p>Driver: <strong>{q.first_name}</strong></p>
                                          <p>Contact: <strong>{q.phone_number}</strong></p>
                                        </div>
                                      </Panel>
                                    </div>
                                  </div>
                                </div>;

                              } else if (q.step === 'Cleaning') {

                                if (q.wash_dry === null) {
                                  step = <div>
                                    <ProgressBar>
                                      <ProgressBar striped active now={10} key={1} label={'Queue'} />
                                      <ProgressBar striped active bsStyle="success" now={30} key={2} label={'Pick-up'}/>
                                      <ProgressBar striped active bsStyle="warning" now={30} key={3} label={'Cleaning'}/>
                                      <ProgressBar bsStyle="info" striped active now={30} key={4} label={'Drop-off'} />
                                    </ProgressBar>
                                    <div className="row popover-info">
                                      <div className="col-sm-12">
                                        <div className="arrow-up-yellow"></div>
                                        <Panel header="Cleaning" bsStyle="warning">
                                          <p className="text-center">. . . Locating cleaning tech</p>
                                        </Panel>
                                      </div>
                                    </div>
                                  </div>;
                                } else {
                                  step = <div>
                                    <ProgressBar>
                                      <ProgressBar striped active now={10} key={1} label={'Queue'} />
                                      <ProgressBar striped active bsStyle="success" now={30} key={2} label={'Pick-up'}/>
                                      <ProgressBar striped active bsStyle="warning" now={30} key={3} label={'Cleaning'}/>
                                      <ProgressBar bsStyle="info" striped active now={30} key={4} label={'Drop-off'} />
                                    </ProgressBar>
                                    <div className="row popover-info">
                                      <div className="col-sm-12">
                                        <div className="arrow-up-yellow"></div>
                                        <Panel header="Cleaning in process!" bsStyle="warning">
                                          <div className="cleaning-font-color">
                                            <p>Cleaning Tech: <strong>{q.first_name}</strong></p>
                                            <p>Contact: <strong>{q.phone_number}</strong></p>
                                          </div>
                                        </Panel>
                                      </div>
                                    </div>
                                  </div>;
                                }
                              } else if (q.step === 'Drop-off') {
                                if (q.dropoff === null) {
                                  step = <div>
                                    <ProgressBar>
                                      <ProgressBar striped active now={10} key={1} label={'Queue'} />
                                      <ProgressBar striped active bsStyle="success" now={30} key={2} label={'Pick-up'}/>
                                      <ProgressBar striped active bsStyle="warning" now={30} key={3} label={'Cleaning'}/>
                                      <ProgressBar striped active bsStyle="danger" now={30} key={4} label={'Drop-off'} />
                                    </ProgressBar>
                                    <div className="row popover-info">
                                      <div className="col-sm-12">
                                        <div className="arrow-up-red"></div>
                                        <Panel header="Drop-off" bsStyle="danger">
                                          <p  className="text-center">. . . Locating driver</p>
                                        </Panel>
                                      </div>
                                    </div>
                                  </div>;
                                } else {
                                  step = <div>
                                    <ProgressBar>
                                      <ProgressBar striped active now={10} key={1} label={'Queue'} />
                                      <ProgressBar striped active bsStyle="success" now={30} key={2} label={'Pick-up'}/>
                                      <ProgressBar striped active bsStyle="warning" now={30} key={3} label={'Cleaning'}/>
                                      <ProgressBar striped active bsStyle="danger" now={30} key={4} label={'Drop-off'} />
                                    </ProgressBar>
                                    <div className="row popover-info">
                                      <div className="col-sm-12">
                                        <div className="arrow-up-red"></div>
                                        <Panel header="Drop-off in route" bsStyle="danger">
                                          <div className="dropoff-font-color">
                                            <p>Driver: <strong>{q.first_name}</strong></p>
                                            <p>Contact: <strong>{q.phone_number}</strong></p>
                                          </div>
                                        </Panel>
                                      </div>
                                    </div>
                                  </div>;
                                }
                              }

                              return <div key={q.id}>
                                <Panel header={`Order: #${q.id}`}>
                                  <div className="row">
                                    <div className="col-sm-12">
                                      <div className="page-header order-status-header">
                                        <h5>{startDate}</h5>
                                      </div>
                                    </div>
                                  </div>

                                  { step }
                                </Panel>
                              </div>
                            })}
                          </div>
                        </div>
                      </Tab>


                      {/* TAB 3 -> COMPLETED ORDERS */}
                      <Tab eventKey={3} title="Completed Orders">
                        <div className="row">
                          <div className="col-sm-12">

                            {/* COMPLETE TABLE */}
                            <div className="complete-table">
                              <BootstrapTable ref="completeTable" hover
                                options={ completeOptions }
                                bordered={ false }
                                data={ this.state.completeOrders }
                                expandableRow={ this.isExpandableRow }
                                expandComponent={ this.expandCompleteComponent }
                                trClassName={this.trClassFormat}
                                pagination
                                search
                              >

                                <TableHeaderColumn
                                  dataField='id'
                                  isKey
                                  width='70px'
                                  dataAlign='center'
                                  expandable={ false }
                                >Order#</TableHeaderColumn>
                                <TableHeaderColumn
                                  dataField='updated_at'
                                  dataFormat={ this.endDateFormatter }
                                  width='100px'
                                  dataAlign='center'
                                  expandable={ false }
                                >Completed</TableHeaderColumn>
                                <TableHeaderColumn
                                  dataField='total'
                                  width='60px'
                                  dataAlign='center'
                                >Total</TableHeaderColumn>

                                <TableHeaderColumn
                                  width='80px'
                                  dataAlign='center'
                                  dataFormat={this.buttonCompleteFormatter}
                                ></TableHeaderColumn>
                              </BootstrapTable>
                            </div>
                          </div>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CustomerProfile);

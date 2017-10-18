import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import { Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel, Table, Tabs, Tab, ProgressBar, Checkbox, Radio, Breadcrumb, Alert, Pager, Form, Col, Row, HelpBlock, Popover, Overlay, OverlayTrigger, ButtonToolbar, ListGroup, ListGroupItem, Modal, Image } from 'react-bootstrap';
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
      showVenmoModal: false,
      alertVenmoVisible: false,
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
      formattedDate: '',
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

    // this.handleRemove = this.handleRemove.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelectKey = this.handleSelectKey.bind(this);
    this.close = this.close.bind(this);
    this.closeInstructions = this.closeInstructions.bind(this);
    this.openInstructions = this.openInstructions.bind(this);
    // this.openRemove = this.openRemove.bind(this);
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
    this.openVenmo = this.openVenmo.bind(this);
    this.closeVenmo = this.closeVenmo.bind(this);
    this.handleVenmoPayment = this.handleVenmoPayment.bind(this);
  }



  componentWillMount() {
    if (localStorage.length > 0) {
      const user = JSON.parse( localStorage.getItem( 'user' ) );
      const token = user.token;

      axios.get('/api/authCustomer', { headers: {token} })
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

          return axios.get(`/api/customerOrders`, { headers: {token} })
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
    } else {
      browserHistory.push('/login');
    }
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
        let selectedTime = moment(this.state.orderPickupTime, 'hh:mm A');
        const now = moment().format('hh:mm A');
        const current = moment(now, "hh:mm A");
        const formatSelectedTime = moment(selectedTime).format('hh:mm A');
        const lastCall = moment('05:00 PM', 'hh:mm A');

        const dur = moment.duration(current.diff(lastCall)).asMilliseconds();
        const mins = dur / 60000;

        // calculate mins between selected time and current time
        const d = moment.duration(selectedTime.diff(current)).asMilliseconds();
        const min = d / 60000;

        // if current time > lastCall
        if (mins < 0) {

          // selected time must be 30 mins > the current time
          if (min < 30) {
            this.props.setToast('Please choose a later pick-up time.', {type: 'error'});
            return;
          }

          this.setState({ orderPickupTime: formatSelectedTime});
        }
      } else {
        this.setState({ orderPickupDate: formatSelectedTime });
      }



      if (customerAddress === '' || customerPhoneNumber === '' || orderPickupTime === '') {
        this.props.setToast('Please check the form & try agian.', {type: 'error'});
        return;
      }

      this.setState({formKey: key, activeServices: false, activeInfo: false, activePayment: true});
    }
  }


  // $$$$$$$$$$$$$$$$$$$$$$  VENMO PAYMENT  $$$$$$$$$$$$$$$$$$$$$$$
  handleVenmoPayment() {
    const { customerEmail, customerAddress, orderServices, orderLoads, customerPhoneNumber, orderInstructions, orderTotalCost, orderPickupTime } = this.state;

    const paymentType = 'Venmo';
    const paymentReceived = false;

    let orderPickupDate = this.state;
    orderPickupDate = moment(orderPickupDate).format('L');

    const newOrder = { customerEmail, customerAddress, orderServices, orderLoads, customerPhoneNumber, orderInstructions, orderPickupDate, orderTotalCost, orderPickupTime, paymentType, paymentReceived };

    const user = JSON.parse( localStorage.getItem( 'user' ) );
    const token = user.token;

    axios.post('/api/customerOrders', {newOrder}, { headers: {token} })
      .then((res) => {
        const data = res.data;
        let q = Object.assign([], this.state.queueOrders);
        q.unshift(data);

        this.setState({
          queueOrders: q,
          showVenmoModal: false,
          customerAddress: this.state.customerAddress,
          orderServices: [],
          orderLoads: 0,
          customerPhoneNumber: this.state.customerPhoneNumber,
          orderInstructions: '',
          orderPickupDate: moment().format('MM-DD-YYYY'),
          formattedDate: '',
          orderTotalCost: 0,
          orderServiceCost: 0,
          orderPickupTime: '',
          paymentType: '',
          paymentReceived: false,
          key: 2,
          formKey: 1,
          alertVenmoVisible: true,
          selectedServiceClean: false,
          selectedServiceFold: false,
          selectedLoadsOption: false
        });

        return axios.post('/api/notify', { newOrder, orderId: data.id }, { headers: {token} })
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
  }




  // $$$$$$$$$$$$$$$$$$$$$$  STRIPE PAYMENT  $$$$$$$$$$$$$$$$$$$$$$$$$$$
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

        const paymentType = 'Credit';
        const paymentReceived = true;

        let orderPickupDate = this.state;
        orderPickupDate = moment(orderPickupDate).format('L');

        const newOrder = { customerEmail, customerAddress, orderServices, orderLoads, customerPhoneNumber, orderInstructions, orderPickupDate, orderTotalCost, orderPickupTime, paymentType, paymentReceived };

        const user = JSON.parse( localStorage.getItem( 'user' ) );
        const token = user.token;

        axios.post('/api/customerOrders', {newOrder}, { headers: {token} })
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
              formattedDate: '',
              orderTotalCost: 0,
              orderServiceCost: 0,
              orderPickupTime: '',
              paymentType: '',
              paymentReceived: false,
              key: 2,
              formKey: 1,
              alertVisible: true,
              selectedServiceClean: false,
              selectedServiceFold: false,
              selectedLoadsOption: false
            });

            return axios.post('/api/notify', { newOrder, orderId: data.id }, { headers: {token} })
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
    this.setState({ alertVisible: false, alertVenmoVisible: false });
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

  closeVenmo() {
    this.setState({ showVenmoModal: false });
  }

  openVenmo() {
    this.setState({ showVenmoModal: true });
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

    // SUCCESS PAYMENT ALERT
    const alert = () => {
      if (this.state.alertVisible) {
        return <Alert bsStyle="success" onDismiss={this.handleAlertDismiss}>
          <h4>Your Payment was a success!</h4>
          <p>Check the progress bar below to track your order.</p>
        </Alert>;
      }
    };

    const venmoAlert = () => {
      if (this.state.alertVenmoVisible) {
        return <Alert bsStyle="success" onDismiss={this.handleAlertDismiss}>
          <h4>Waiting for Venmo payment to be sent!</h4>
          <p>Check the progress bar below to track your order.</p>
        </Alert>;
      }
    }

    const dashboard = (
      <h3>Welcome, <small>{customerFirstName}</small></h3>
    );

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

      // if current time is passed 05:01 PM
      // set order pick-up date to tomorrows date
      let time = lastCall.diff(start);

      if (time < 0) {
        const today = moment();
        const day = moment();
        let d = day.add('days', 1);
        let tomorrow = today.add('days', 1);
        tomorrow = moment(tomorrow).format('MMMM Do YYYY');
        d = moment(day).format('dddd');

        return <div className="col-xs-12 col-sm-5 col-md-5 order-date">
          <div className="row">
            <div className="col-sm-12 order-date-label">
              <ControlLabel><em>Tomorrow's date:</em></ControlLabel>
            </div>
          </div>
          <div className="row order-date-row">
            <div className="col-xs-3 col-sm-3 text-right">
              <span className="glyphicon glyphicon-calendar" aria-hidden="true"></span>
            </div>
            <div className="col-xs-9 col-sm-9 text-center">
              <p><strong>{d + ','}</strong></p>
              <p><small><em>{tomorrow}</em></small></p>
            </div>
          </div>
        </div>;
      } else {
        let today = moment();
        let day = moment();
        today = moment(today).format('MMMM Do YYYY');
        day = moment(day).format('dddd');

        return <div className="col-xs-12 col-sm-5 col-md-5 order-date">
          <div className="row">
            <div className="col-sm-12 order-date-label">
              <ControlLabel><em>Today's date:</em></ControlLabel>
            </div>
          </div>
          <div className="row order-date-row">
            <div className="col-xs-3 col-sm-3 text-right">
              <span className="glyphicon glyphicon-calendar" aria-hidden="true"></span>
            </div>
            <div className="col-xs-9 col-sm-9 text-center">
              <p><strong>{day + ','}</strong></p>
              <p><small><em>{today}</em></small></p>
            </div>
          </div>
        </div>;
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

    const formatSummaryDate = () => {
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
        const day = moment();
        let d = day.add(1, 'days');
        let tomorrow = today.add(1, 'days');
        tomorrow = moment(tomorrow).format('MMMM Do YYYY');
        let formatDay = moment(d).format('dddd');

        return <div className="col-xs-8 col-sm-8 text-center date-text">
          <p><strong>{formatDay},</strong></p>
          <p><small>{tomorrow}</small></p>
        </div>;
      } else {
        let today = moment();
        let day = moment();
        today = moment(today).format('MMMM Do YYYY');
        let formatDay = moment(day).format('dddd');

        return <div className="col-xs-8 col-sm-8 text-center date-text">
          <p><strong>{formatDay},</strong></p>
          <p><small>{today}</small></p>
        </div>;
      }
    }




    const form = () => {
      let {formKey} = this.state;

      if (formKey === 1) {
        return <div className="row order-services">
          <div className="col-xs-12 col-sm-10 col-sm-offset-1">
            <Form horizontal>

              {/* SERVICES */}
              <div className="row">
                <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1 services-input-header">
                  <div className="col-xs-4 col-sm-4">
                    <p>STEP 1</p>
                  </div>
                  <div className="col-xs-8 col-sm-8 text-center question">
                    <p><em>Select your service(s).</em></p>
                  </div>
                </div>
              </div>

              <FormGroup>
                <div className="text-center">
                  <Col componentClass={ControlLabel} xs={3} xsOffset={1} sm={3} smOffset={1}>
                    <i className="fa fa-check-square-o" aria-hidden="true"></i>
                  </Col>
                </div>
                <div className="order-checkbox text-center">
                  <Col xs={8} sm={8}>
                    <Checkbox
                      inline
                      value={['clean', 10]}
                      onChange={this.handleBoxChange.bind(this)}
                      checked={this.state.selectedServiceClean}
                    >
                      <strong>Wash / Dry <small><em>- $10</em></small></strong>
                    </Checkbox>
                  </Col>
                  <Col xs={8} sm={8}>
                    <span className="fold-checkbox">
                      <Checkbox
                        inline
                        value={['fold', 2.50]}
                        onChange={this.handleBoxChange.bind(this)}
                        checked={this.state.selectedServiceFold}
                      >
                        <strong>Fold <small><em>- $2.50</em></small></strong>
                      </Checkbox>
                    </span>
                  </Col>
                </div>
              </FormGroup>

              <div className="row">
                <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1 tab-1-divider">
                </div>
              </div>

              {/* NUMBER OF LOADS */}
              <div className="row">
                <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1 services-input-header">
                  <div className="col-xs-4 col-sm-4">
                    <p>STEP 2</p>
                  </div>
                  <div className="col-xs-8 col-sm-8 text-center question">
                    <p><em>How many loads?</em></p>
                  </div>
                </div>
              </div>

              <FormGroup>
                <div className="text-center">
                  <Col componentClass={ControlLabel} xs={3} xsOffset={1} sm={3} smOffset={1}>
                    <img className="services-load-img" src="images/load.svg" />
                  </Col>
                </div>
                <div className="order-radio text-center">
                  <Col xs={8} sm={8}>
                    <Radio
                      name="radioGroup"
                      inline
                      name="orderLoads"
                      value={1}
                      onChange={this.handleRadioChange.bind(this)}
                      checked={this.state.selectedLoadsOption === 1}
                    >
                      <strong>1</strong>
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
                      <strong>2</strong>
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
                      <strong>3</strong>
                    </Radio>
                  </Col>
                </div>
              </FormGroup>

              <div className="row">
                <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1 tab-1-divider">
                </div>
              </div>

              {/* INSTRUCTIONS */}
              <div className="row">
                <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1 services-input-header">
                  <div className="col-xs-4 col-sm-4">
                    <p>STEP 3</p>
                  </div>
                  <div className="col-xs-8 col-sm-8 text-center question">
                    <p><em>Instructions<small> - optional</small></em></p>
                  </div>
                </div>
              </div>

              <FormGroup validationState={this.textareaValidationState()}>
                <div className="text-center">
                  <Col componentClass={ControlLabel} xs={3} xsOffset={1} sm={3} smOffset={1}>
                    <i className="fa fa-envelope-o" aria-hidden="true"></i>
                  </Col>
                </div>
                <div className="order-instructions text-center">
                  <Col xs={7} sm={7}>
                    <FormControl
                      componentClass="textarea"
                      type="text"
                      placeholder="Your short message."
                      name="orderInstructions"
                      value={this.state.orderInstructions}
                      onChange={this.handleChange.bind(this)}
                    />
                    <HelpBlock><small><em>90 character max.</em></small></HelpBlock>
                  </Col>
                </div>
              </FormGroup>

              <div className="row">
                <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1 tab-1-divider">
                </div>
              </div>

              {/* ACTION BTNS */}
              <div className="row ">
                <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                  <Pager>
                    <Pager.Item href="#" next onClick={() => this.handleTotalCost(2)}>Next &rarr;</Pager.Item>
                  </Pager>
                </div>
              </div>
            </Form>
          </div>
        </div>;
      } else if (formKey === 2) {
        return <div className="row order-info">
          <div className="col-xs-12 col-sm-10 col-sm-offset-1">
            <Form>

              {/* ADDRESS */}
              <div className="row">
                <div className="col-xs-8 col-xs-offset-2 col-sm-10 col-sm-offset-1">
                  <FormGroup bsSize="large">
                    <ControlLabel><em>Laundry pick-up location:</em></ControlLabel>
                    <InputGroup>
                      <InputGroup.Addon>
                        <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
                      </InputGroup.Addon>
                      <FormControl
                        type="text"
                        placeholder={this.state.customerAddress}
                        name="customerAddress"
                        value={this.state.customerAddress}
                        onChange={this.handleChange.bind(this)}
                      />
                    </InputGroup>
                  </FormGroup>
                </div>
              </div>

              <div className="row">
                <div className="col-xs-8 col-xs-offset-2 col-sm-10 col-sm-offset-1 tab-2-divider">
                </div>
              </div>


              {/* CONTACT */}
              <div className="row">
                <div className="col-xs-8 col-xs-offset-2 col-sm-10 col-sm-offset-1">
                  <FormGroup bsSize="large">
                    <ControlLabel><em>Contact:</em></ControlLabel>
                    <InputGroup>
                      <InputGroup.Addon>
                        <span className="glyphicon glyphicon-phone" aria-hidden="true"></span>
                      </InputGroup.Addon>
                      <FormControl
                        type="text"
                        placeholder={this.state.customerPhoneNumber}
                        name="customerPhoneNumber"
                        value={this.state.customerPhoneNumber}
                        onChange={this.handleChange.bind(this)}
                      />
                    </InputGroup>
                  </FormGroup>
                </div>
              </div>

              <div className="row">
                <div className="col-xs-8 col-xs-offset-2 col-sm-10 col-sm-offset-1 tab-2-divider">
                </div>
              </div>





              {/* DATE & TIME */}
              <div className="row">
                <div className="col-xs-8 col-xs-offset-2 col-sm-10 col-sm-offset-1 order-date-time">



                  {checkDate()}


                  <div className="col-xs-12 col-sm-6 col-sm-offset-1 col-md-6 col-md-offset-1 order-time-col">
                    <ControlLabel><em>Select a pick-up time:</em></ControlLabel>
                    <div className="order-time">
                      <FormGroup bsSize="large">
                        <InputGroup>
                          <InputGroup.Addon>
                            <span className="glyphicon glyphicon-time" aria-hidden="true"></span>
                          </InputGroup.Addon>
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
                        </InputGroup>

                        <div className="text-center">
                          <HelpBlock><small>* Schedule at least 30min from current time.</small></HelpBlock>
                        </div>
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xs-8 col-xs-offset-2 col-sm-10 col-sm-offset-1 tab-2-divider">
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
                <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1">
                  <Pager>
                    <Pager.Item href="#" previous onClick={() => this.handleSelectKey(1)}>&larr; Back</Pager.Item>
                    <Pager.Item href="#" next onClick={() => this.handleSelectKey(3)}>Next &rarr;</Pager.Item>
                  </Pager>
                </div>
              </div>
            </Form>
          </div>
        </div>;
      } else if (formKey === 3) {
        return <div className="order-payment">

          {/* PAYMENT */}
          <div className="row">
            <div className="col-xs-12 col-sm-12">
              <div className="row">
                <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 text-center">
                  <div className="page-header">
                    <h2><strong>Order Summary</strong></h2>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                  <div className="order-summary">
                    <Panel>
                      <div className="row">
                        <div className="col-xs-4 col-sm-4 text-center">
                          <span>
                            <i className="fa fa-calendar" aria-hidden="true"></i>
                          </span>
                        </div>

                        {formatSummaryDate()}

                      </div>
                      <div className="row">
                        <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1 order-divider">
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-4 col-sm-4 text-center">
                          <span>
                            <i className="fa fa-clock-o" aria-hidden="true"></i>
                          </span>
                        </div>
                        <div className="col-xs-8 col-sm-8 text-center">
                          <p><strong>{this.state.orderPickupTime}</strong></p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1 order-divider">
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-4 col-sm-4 text-center">
                          <i className="fa fa-check-square-o" aria-hidden="true"></i>
                        </div>
                        <div className="col-xs-8 col-sm-8 text-center">
                          <strong>
                            <p>{services()}</p>
                          </strong>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1 order-divider">
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-4 col-sm-4 text-center">
                          <img className="order-load-img" src="images/load.svg" />
                        </div>
                        <div className="col-xs-8 col-sm-8 text-center">
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
                              <h4><strong>Total: </strong> ${this.state.orderTotalCost}</h4>
                            </strong>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 order-divider">
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-xs-12 col-sm-12 text-center">
                            <p><em>How would you like to pay?</em></p>
                          </div>
                        </div>

                        <div className="row checkout-row">
                          <div className="col-xs-12 col-sm-5 text-center venmo-img">
                            <Button bsStyle="primary" onClick={() => {this.openVenmo()}}>
                              <img src="images/venmo.svg"/>
                            </Button>
                          </div>
                          <div className="col-xs-12 col-sm-2 text-center ">
                            <h5>OR</h5>
                          </div>

                          <div className="col-xs-12 col-sm-5 text-center stripe-btn">
                            {/* STRIPE PAYMENT BTN */}
                            <div>
                              <StripeCheckout
                                name="Laundry Service"
                                description="Pick-up, clean, & drop-off!"
                                amount={this.state.orderTotalCost * 100}
                                token={this.onToken}
                                currency="USD"
                                stripeKey={STRIPE_PUBLISHABLE}
                              />
                            </div>
                            <div className="powered-by-stripe">
                              <img src="images/powered_by_stripe.svg"/>
                            </div>
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
            <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1">
              {/* ACTION BTNS */}
              <Pager>
                <Pager.Item href="#" previous onClick={() => this.handleSelectKey(2)}>&larr; Back</Pager.Item>
              </Pager>
            </div>
          </div>
        </div>;
      }
    }
























    return (
      <div className="row customer-profile">
        <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 customer-profile-col">

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

          <Modal show={this.state.showVenmoModal} onHide={this.closeVenmo}>
            <Modal.Header closeButton>
              <Modal.Title>Venmo Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-xs-12 col-sm-12 text-center">
                  <p><small><em>Pay to:</em></small><strong> LaundrySucks</strong></p>
                  <p><em>We will begin your order as soon as the payment has been received via Venmo.</em></p>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => {this.handleVenmoPayment()}}
                bsStyle="primary"
              >
                Accept
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="row profile-header">
            <div className="col-sm-8 col-sm-offset-2">
              <div className="row">
                <div className="col-sm-12 text-center">
                  <div className="page-header">
                    <h1>ACCOUNT</h1>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 text-center">
                  <i className="fa fa-user-o" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>



          <div className="row welcome-customer">
            <div className="col-xs-12 col-sm-12 welcome-customer-wrapper">
              <div className="row">
                <div className="col-sm-10 col-sm-offset-1">
                  <div className="page-header">
                    <h2>Welcome, <small><em>{customerFirstName}</em></small></h2>
                  </div>
                </div>
              </div>


              <div className="row welcome-order-form">
                <div className="col-xs-12 col-sm-12">
                  <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="welcome-order-form">


                    {/* TAB 1 -> ORDER FORM */}
                    <Tab eventKey={1} title="SCHEDULE PICK-UP">
                      <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 order-form-panel">
                          <Breadcrumb>
                            <Breadcrumb.Item href="#" onClick={() => {this.handleSelectKey(1)}} active={this.state.activeServices}>
                              SERVICES
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="#" onClick={() => {this.handleTotalCost(2)}} active={this.state.activeInfo}>
                              INFO
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="#" onClick={() => {this.handleSelectKey(3)}} active={this.state.activePayment}>
                              PAYMENT
                            </Breadcrumb.Item>
                          </Breadcrumb>


                          {/* NEW ORDER FORM */}
                          {form()}
                        </div>
                      </div>
                    </Tab>



                    {/* TAB 2 -> ORDER STATUS */}
                    <Tab eventKey={2} title="ORDER STATUS">
                      <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 order-status-wrapper">
                          {/* SUCCESS PAYMENT ALERT */}
                          {alert()}
                          {venmoAlert()}

                          {this.state.queueOrders.map((q) => {

                            const startDate = moment(q.created_at).format('L');
                            let step;
                            let employee = {};

                            if (q.step === 'Queue') {
                              step = (
                                <div className="row order-progress">
                                  <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1">

                                    <ProgressBar>
                                      <ProgressBar bsStyle="info" striped active now={33} key={1} label={'Pick-up'}/>
                                      <ProgressBar bsStyle="info" striped active now={34} key={2} label={'Cleaning'}/>
                                      <ProgressBar bsStyle="info" striped active now={33} key={3} label={'Drop-off'} />
                                    </ProgressBar>

                                    <div className="row">
                                      <div className="col-sm-12 popover-info text-center">
                                        <i className="fa fa-spinner fa-spin fa-5x fa-fw"></i>
                                        <span className="sr-only">IN PROGRESS...</span>
                                        <h4>IN PROGRESS...</h4>
                                        <p>Please kindly wait, we are processing your order.</p>
                                        <p>
                                          <i className="fa fa-clock-o" aria-hidden="true"></i>
                                          <small><em>Your laundry will be ready for you within 48 hours</em></small>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>);
                            } else if (q.step === 'Pick-up') {
                              step = <div className="row order-progress">
                                <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1">
                                  <ProgressBar>
                                    <ProgressBar striped active now={33} key={1} label={'Pick-up'}/>
                                    <ProgressBar bsStyle="info" striped active now={34} key={2} label={'Cleaning'}/>
                                    <ProgressBar bsStyle="info" striped active now={33} key={3} label={'Drop-off'} />
                                  </ProgressBar>



                                  <div className="row">
                                    <div className="col-sm-12 popover-info text-center">
                                      <Image src="images/driver.svg"/>
                                      <h4>PICK-UP IN ROUTE!</h4>
                                      <p><em>Our driver is in route to your pick-up location.</em></p>

                                      <div className="row driver-info">
                                        <div className="col-sm-10 col-sm-offset-1">
                                          <p><strong>Driver: </strong>{ q.first_name}</p>
                                          <p><strong>Contact: </strong> {q.phone_number}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>;

                            } else if (q.step === 'Cleaning') {

                              if (q.wash_dry === null) {
                                step = <div className="row order-progress">
                                  <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1">
                                    <ProgressBar>
                                      <ProgressBar striped active now={33} key={1} label={'Pick-up'}/>
                                      <ProgressBar striped active now={34} key={2} label={'Cleaning'}/>
                                      <ProgressBar bsStyle="info" striped active now={33} key={3} label={'Drop-off'} />
                                    </ProgressBar>
                                    <div className="row">
                                      <div className="col-sm-12 popover-info text-center">
                                        <i className="fa fa-spinner fa-spin fa-5x fa-fw"></i>
                                        <span className="sr-only">IN PROGRESS...</span>
                                        <h4>LOCATING CLEANING TECH...</h4>
                                        <p><em>Please kindly wait, we are assigning a cleaning technician.</em></p>
                                      </div>
                                    </div>
                                  </div>
                                </div>;
                              } else {
                                step = <div className="row order-progress">
                                  <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1">
                                    <ProgressBar>
                                      <ProgressBar striped active now={33} key={1} label={'Pick-up'}/>
                                      <ProgressBar striped active now={34} key={2} label={'Cleaning'}/>
                                      <ProgressBar bsStyle="info" striped active now={33} key={3} label={'Drop-off'} />
                                    </ProgressBar>
                                    <div className="row">
                                      <div className="col-sm-12 popover-info text-center">
                                        <Image src="images/wash-clothes.svg"/>
                                        <h4>CLEANING IN PROGRESS!!!</h4>
                                        <div className="row driver-info">
                                          <div className="col-sm-10 col-sm-offset-1">
                                            <p><strong>Tech: </strong>{ q.first_name}</p>
                                            <p><strong>Contact: </strong> {q.phone_number}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>;
                              }
                            } else if (q.step === 'Drop-off') {
                              if (q.dropoff === null) {
                                step = <div className="row order-progress">
                                  <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1">
                                    <ProgressBar>
                                      <ProgressBar striped active now={33} key={1} label={'Pick-up'}/>
                                      <ProgressBar striped active now={34} key={2} label={'Cleaning'}/>
                                      <ProgressBar striped active now={33} key={3} label={'Drop-off'} />
                                    </ProgressBar>
                                    <div className="row">
                                      <div className="col-sm-12 popover-info text-center">
                                        <i className="fa fa-spinner fa-spin fa-5x fa-fw"></i>
                                        <span className="sr-only">IN PROGRESS...</span>
                                        <h4>LOCATING DRIVER...</h4>
                                        <p><em>Please kindly wait, we are assigning a driver.</em></p>
                                      </div>
                                    </div>
                                  </div>
                                </div>;
                              } else {
                                step = <div className="row order-progress">
                                  <div className="col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1">
                                    <ProgressBar>
                                      <ProgressBar striped active now={33} key={1} label={'Pick-up'}/>
                                      <ProgressBar striped active now={34} key={2} label={'Cleaning'}/>
                                      <ProgressBar striped active now={33} key={3} label={'Drop-off'} />
                                    </ProgressBar>
                                    <div className="row">
                                      <div className="col-sm-12 popover-info text-center">
                                        <Image src="images/bag.svg"/>
                                        <h4>DROP-OFF IN ROUTE!</h4>
                                        <div className="row driver-info">
                                          <div className="col-sm-10 col-sm-offset-1">
                                            <p><strong>Driver: </strong>{ q.first_name}</p>
                                            <p><strong>Contact: </strong> {q.phone_number}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>;
                              }
                            }

                            return <div key={q.id} className="order-status">
                              <Panel header={`ORDER: #${q.id}`}>
                                <div className="row">
                                  <div className="col-xs-10 col-xs-offset-1  col-sm-10 col-sm-offset-1">
                                    <div className="page-header">
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
                    <Tab eventKey={3} title="COMPLETED ORDERS">
                      <div className="row">
                        <div className="col-xs-12 col-sm-12 completed-orders">
                          <Panel header="COMPLETED ORDERS">
                            <div className="row">
                              <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1">
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
                          </Panel>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CustomerProfile);

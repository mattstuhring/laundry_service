import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import { Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel, Table, Tabs, Tab, Checkbox, Radio, Image } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn, InsertButton, DeleteButton} from 'react-bootstrap-table';
import moment from 'moment';
import Popup from 'Popup';
import Countdown from 'react-countdown-now';




class AdminOrders extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      orderId: null,
      taskId: null,
      table: '',
      firstName: '',
      orderStep: '',
      venmoOrders: [],
      queueOrders: [],
      completeOrders: [],
      activeOrders: [],
      myOrders: [],
      selectedVenmoOrders: [],
      selectedQueueOrders: [],
      selectedActiveOrders: [],
      selectedCompleteOrders: [],
      showModal: false,
      modal: {
        title: '',
        message: '',
        action: null
      }
    }

    this.close = this.close.bind(this);
    this.openVenmo = this.openVenmo.bind(this);
    this.openActive = this.openActive.bind(this);
    this.openComplete = this.openComplete.bind(this);
    this.openRemoveOrder = this.openRemoveOrder.bind(this);
    this.openStepBack = this.openStepBack.bind(this);
    this.handleVenmo = this.handleVenmo.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleRemoveOrder = this.handleRemoveOrder.bind(this);
    this.handleStepBack = this.handleStepBack.bind(this);
    this.queueButtons = this.queueButtons.bind(this);
    this.venmoButtons = this.venmoButtons.bind(this);
    this.activeButtons = this.activeButtons.bind(this);
    this.completeButtons = this.completeButtons.bind(this);
    this.onQueueRowSelect = this.onQueueRowSelect.bind(this);
    this.onQueueSelectAll = this.onQueueSelectAll.bind(this);
    this.onVenmoRowSelect = this.onVenmoRowSelect.bind(this);
    this.onVenmoSelectAll = this.onVenmoSelectAll.bind(this);
    this.onActiveRowSelect = this.onActiveRowSelect.bind(this);
    this.onActiveSelectAll = this.onActiveSelectAll.bind(this);
    this.onCompleteRowSelect = this.onCompleteRowSelect.bind(this);
    this.onCompleteSelectAll = this.onCompleteSelectAll.bind(this);
    this.startDateFormatter = this.startDateFormatter.bind(this);
    this.endDateFormatter = this.endDateFormatter.bind(this);
    this.customSearch = this.customSearch.bind(this);
    this.isExpandableRow = this.isExpandableRow.bind(this);
    this.expandComponent = this.expandComponent.bind(this);
    this.buttonFormatter = this.buttonFormatter.bind(this);
    this.cleanFormatter = this.cleanFormatter.bind(this);
    this.foldFormatter = this.foldFormatter.bind(this);
    this.countdownFormatter = this.countdownFormatter.bind(this);
    this.hourFormatter = this.hourFormatter.bind(this);
    this.pickupFormatter = this.pickupFormatter.bind(this);
    this.washFormatter = this.washFormatter.bind(this);
    this.dropoffFormatter = this.dropoffFormatter.bind(this);
    this.trClassFormat = this.trClassFormat.bind(this);
  }


  componentWillMount() {
    if (localStorage.length > 0) {
      const user = JSON.parse( localStorage.getItem( 'user' ) );
      const token = user.token;

      axios.get('/api/authAdmin', { headers: {token} })
        .then((res) => {
          const data = res.data[0];
          this.setState({firstName: data.firstName});

          return axios.get('/api/admin', { headers: {token} })
            .then((res) => {
              this.setState({
                venmoOrders: res.data[0],
                queueOrders: res.data[1],
                completeOrders: res.data[2],
                activeOrders: res.data[3],
                myOrders: res.data[4],
                selectedActiveOrders: [],
                selectedQueueOrders: [],
                selectedCompleteOrders: []
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



  handleVenmo() {
    const { selectedVenmoOrders } = this.state;
    const user = JSON.parse( localStorage.getItem( 'user' ) );
    const token = user.token;

    axios.put('/api/adminVenmo', {selectedVenmoOrders}, { headers: {token} })
      .then(() => {
        this.refs.venmoTable.cleanSelected();
        this.refs.venmoTable.setState({
          selectedRowKeys: []
        });

        return axios.get('/api/admin', { headers: {token} })
          .then((res) => {
            this.setState({
              showModal: false,
              venmoOrders: res.data[0],
              queueOrders: res.data[1],
              completeOrders: res.data[2],
              activeOrders: res.data[3],
              myOrders: res.data[4],
              selectedVenmoOrders: [],
              selectedActiveOrders: [],
              selectedQueueOrders: [],
              selectedCompleteOrders: []
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




  handleActive() {
    const { selectedQueueOrders } = this.state;
    const check = 'active';
    const user = JSON.parse( localStorage.getItem( 'user' ) );
    const token = user.token;

    axios.put('/api/admin', {selectedQueueOrders, check}, { headers: {token} })
      .then((r) => {
        this.refs.queueTable.cleanSelected();

        this.refs.queueTable.setState({
          selectedRowKeys: []
        });

        return axios.get('/api/admin', { headers: {token} })
          .then((res) => {

            this.setState({
              venmoOrders: res.data[0],
              queueOrders: res.data[1],
              completeOrders: res.data[2],
              activeOrders: res.data[3],
              myOrders: res.data[4],
              selectedQueueOrders: [],
              selectedActiveOrders: [],
              showModal: false
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
    const { selectedActiveOrders } = this.state;
    const user = JSON.parse( localStorage.getItem( 'user' ) );
    const token = user.token;

    axios.post('/api/admin', { selectedActiveOrders }, { headers: {token} })
      .then((r) => {
        this.refs.activeTable.cleanSelected();
        this.refs.activeTable.setState({
          selectedRowKeys: []
        });

        return axios.get('/api/admin', { headers: {token} })
          .then((res) => {

            this.setState({
              showModal: false,
              venmoOrders: res.data[0],
              queueOrders: res.data[1],
              completeOrders: res.data[2],
              activeOrders: res.data[3],
              myOrders: res.data[4],
              selectedActiveOrders: [],
              selectedQueueOrders: []
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



  handleRemoveOrder() {
    const { table } = this.state;
    let selectedOrders;

    if (table === 'queue') {
      selectedOrders = this.state.selectedQueueOrders;
    } else if (table === 'active') {
      selectedOrders = this.state.selectedActiveOrders;
    } else if (table === 'complete') {
      selectedOrders = this.state.selectedCompleteOrders;
    } else if (table === 'venmo') {
      selectedOrders = this.state.selectedVenmoOrders;
    }

    const user = JSON.parse( localStorage.getItem( 'user' ) );
    const token = user.token;

    axios.put('/api/adminDeleteOrder', {selectedOrders}, { headers: {token} })
      .then((r) => {
        if (table === 'queue') {
          this.refs.queueTable.cleanSelected();
          this.refs.queueTable.setState({
            selectedRowKeys: []
          });
        } else if (table === 'active') {
          this.refs.activeTable.cleanSelected();
          this.refs.activeTable.setState({
            selectedRowKeys: []
          });
        } else if (table === 'complete') {
          this.refs.completeTable.cleanSelected();
          this.refs.completeTable.setState({
            selectedRowKeys: []
          });
        } else if (table === 'venmo') {
          this.refs.venmoTable.cleanSelected();
          this.refs.venmoTable.setState({
            selectedRowKeys: []
          });
        }

        return axios.get('/api/admin', { headers: {token} })
          .then((res) => {
            this.setState({
              showModal: false,
              venmoOrders: res.data[0],
              queueOrders: res.data[1],
              completeOrders: res.data[2],
              activeOrders: res.data[3],
              myOrders: res.data[4],
              selectedVenmoOrders: [],
              selectedActiveOrders: [],
              selectedQueueOrders: [],
              selectedCompleteOrders: [],
              table: ''
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        return;
      });

  }




  handleStepBack() {
    const { table } = this.state;
    let selectedOrders;

    if (table === 'queue') {
      selectedOrders = this.state.selectedQueueOrders;
    } else if (table === 'active') {
      selectedOrders = this.state.selectedActiveOrders;
    }

    const user = JSON.parse( localStorage.getItem( 'user' ) );
    const token = user.token;

    axios.put('/api/adminRemoveOrder', { selectedOrders }, { headers: {token} })
      .then((r) => {
        if (table === 'queue') {
          this.refs.queueTable.cleanSelected();
          this.refs.queueTable.setState({
            selectedRowKeys: []
          });
        } else if (table === 'active') {
          this.refs.activeTable.cleanSelected();
          this.refs.activeTable.setState({
            selectedRowKeys: []
          });
        }

        return axios.get(`/api/admin`, { headers: {token} })
          .then((res) => {
            this.setState({
              showModal: false,
              venmoOrders: res.data[0],
              queueOrders: res.data[1],
              completeOrders: res.data[2],
              activeOrders: res.data[3],
              myOrders: res.data[4],
              selectedActiveOrders: [],
              selectedQueueOrders: [],
              table: ''
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




  close() {
    this.setState({ showModal: false });
  }

  openVenmo() {
    this.setState({
      showModal: true,
      modal: {
        title: 'VENMO PAYMENT',
        message: 'Did you receive the customers venmo payment?',
        action: this.handleVenmo
      }
    });
  }


  openActive() {
    this.setState({
      showModal: true,
      modal: {
        title: 'ORDERS',
        message: 'Do you accept the order(s)?',
        action: this.handleActive
      }
    });
  }


  openRemoveOrder(tableName) {
    this.setState({
      showModal: true,
      table: tableName,
      modal: {
        title: 'ORDER',
        message: 'Warning: You are about to delete the selected order(s)?',
        action: this.handleRemoveOrder
      }
    });
  }


  openStepBack(tableName) {
    this.setState({
      showModal: true,
      table: tableName,
      modal: {
        title: 'ORDER',
        message: 'WHOOPS! Put order back into the queue?',
        action: this.handleStepBack
      }
    });
  }


  openComplete() {
    this.setState({
      showModal: true,
      modal: {
        title: 'JOBS',
        message: 'Did you complete the job(s)?',
        action: this.handleComplete
      }
    });
  }





  queueButtons() {
  	return (
      <div>
        <Button
          bsStyle="success"
          bsSize="small"
          onClick={() => this.openActive()}
        >
          <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
          {' '}Accept Job
        </Button>
        {' '}
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={() => this.openRemoveOrder('queue')}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          {' '}Delete Order
        </Button>
        {' '}
        <Button
          bsStyle="warning"
          bsSize="small"
          onClick={() => this.openStepBack('queue')}
        >
          <span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
          {' '}Go Back a Step
        </Button>
      </div>
    );
  }




  venmoButtons() {
  	return (
      <div>
        <Button
          bsStyle="success"
          bsSize="small"
          onClick={() => this.openVenmo()}
        >
          <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
          {' '}Payment Received
        </Button>
        {' '}
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={() => this.openRemoveOrder('venmo')}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          {' '}Delete Order
        </Button>
      </div>
    );
  }



  activeButtons() {
    return (
      <div>
        <Button
          bsStyle="success"
          bsSize="small"
          onClick={() => this.openComplete()}
        >
          <span className="glyphicon glyphicon-check" aria-hidden="true"></span>
          {' '}Complete Job
        </Button>
        {' '}
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={() => this.openRemoveOrder('active')}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          {' '}Delete Order
        </Button>
        {' '}
        <Button
          bsStyle="warning"
          bsSize="small"
          onClick={() => this.openStepBack('active')}
        >
          <span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
          {' '}Go Back a Step
        </Button>
      </div>
    );
  }



  completeButtons() {
    return (
      <div>
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={() => this.openRemoveOrder('complete')}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          {' '}Delete
        </Button>
      </div>
    );
  }

  onVenmoRowSelect(row, isSelected, e) {
    let arr = Object.assign([], this.state.selectedVenmoOrders);

    if (isSelected) {
      arr.push(row);
      this.setState({selectedVenmoOrders: arr});
    }
    else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === row.id) {
          arr.splice(i, 1);
        }
      }

      this.setState({ selectedVenmoOrders: arr});
    }
  }



  onVenmoSelectAll(isSelected, rows) {
    let arr = Object.assign([], this.state.selectedVenmoOrders);

    if (isSelected) {
      for (let i = 0; i < rows.length; i++) {
        arr.push(rows[i]);
      }

      this.setState({selectedVenmoOrders: arr});
    } else {
      this.setState({selectedVenmoOrders: []});
    }
  }




  onQueueRowSelect(row, isSelected, e) {
    let arr = Object.assign([], this.state.selectedQueueOrders);

    if (isSelected) {
      arr.push(row);
      this.setState({selectedQueueOrders: arr, selectedActiveOrders: []});
    }
    else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === row.id) {
          arr.splice(i, 1);
        }
      }

      this.setState({ selectedQueueOrders: arr});
    }
  }



  onQueueSelectAll(isSelected, rows) {
    let arr = Object.assign([], this.state.selectedQueueOrders);

    if (isSelected) {
      for (let i = 0; i < rows.length; i++) {
        arr.push(rows[i]);
      }

      this.setState({selectedQueueOrders: arr, selectedActiveOrders: []});
    } else {
      this.setState({selectedQueueOrders: []});
    }
  }



  onActiveRowSelect(row, isSelected, e) {
    let arr = Object.assign([], this.state.selectedActiveOrders);

    if (isSelected) {
      arr.push(row);
      this.setState({selectedActiveOrders: arr, selectedQueueOrders: []});
    }
    else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === row.id) {
          arr.splice(i, 1);
        }
      }

      this.setState({ selectedActiveOrders: arr, selectedQueueOrders: []});
    }
  }



  onActiveSelectAll(isSelected, rows) {
    let arr = Object.assign([], this.state.selectedActiveOrders);

    if (isSelected) {
      for (let i = 0; i < rows.length; i++) {
        arr.push(rows[i]);
      }

      this.setState({selectedActiveOrders: arr, selectedQueueOrders: []});
    } else {
      this.setState({selectedActiveOrders: [], selectedQueueOrders: []});
    }
  }




  onCompleteRowSelect(row, isSelected, e) {
    let arr = Object.assign([], this.state.selectedCompleteOrders);

    if (isSelected) {
      arr.push(row);
      this.setState({selectedCompleteOrders: arr});
    }
    else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === row.id) {
          arr.splice(i, 1);
        }
      }

      this.setState({ selectedCompleteOrders: arr});
    }
  }



  onCompleteSelectAll(isSelected, rows) {
    let arr = Object.assign([], this.state.selectedCompleteOrders);

    if (isSelected) {
      for (let i = 0; i < rows.length; i++) {
        arr.push(rows[i]);
      }

      this.setState({selectedCompleteOrders: arr});
    } else {
      this.setState({selectedCompleteOrders: []});
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



  startDateFormatter(cell, row) {
    const startDate = moment(row.created_at).format('L');
    return startDate;
  }


  endDateFormatter(cell, row) {
    const endDate = moment(row.updated_at).format('L');
    return endDate;
  }



  isExpandableRow(row) {
    if (row.id) {
      return true;
    } else {
      return false;
    }
  }


  expandComponent(row) {
    return (
      <div className="expand-row">
        <BootstrapTable data={ [row] }>
          <TableHeaderColumn
            isKey={ true }
            dataField='amount'
            width='90px'
            dataAlign='center'
          >LOADS</TableHeaderColumn>
          <TableHeaderColumn
            dataField='clean'
            width='110px'
            dataAlign='center'
            dataFormat={this.cleanFormatter}
          >WASH/DRY</TableHeaderColumn>
          <TableHeaderColumn
            dataField='fold'
            width='90px'
            dataAlign='center'
            dataFormat={this.foldFormatter}
          >FOLD</TableHeaderColumn>
          <TableHeaderColumn
            dataField='pickup'
            width='100px'
            dataAlign='center'
            dataFormat={this.pickupFormatter}
          >PICK-UP</TableHeaderColumn>
          <TableHeaderColumn
            dataField='wash_dry'
            width='80px'
            dataAlign='center'
            dataFormat={this.washFormatter}
          >CLEAN</TableHeaderColumn>
          <TableHeaderColumn
            dataField='dropoff'
            width='110px'
            dataAlign='center'
            dataFormat={this.dropoffFormatter}
          >DROP-OFF</TableHeaderColumn>
          <TableHeaderColumn
            dataField='total'
            width='80px'
            dataAlign='center'
          >TOTAL</TableHeaderColumn>
          <TableHeaderColumn
            dataField='instructions'
            dataAlign='center'
            tdStyle={ { whiteSpace: 'normal' } }
          >INSTRUCTIONS</TableHeaderColumn>
        </BootstrapTable>
        <BootstrapTable data={ [row] }>
          <TableHeaderColumn
            isKey={ true }
            dataField='customer_id'
            width='60px'
            dataAlign='center'
          >ID#</TableHeaderColumn>
          <TableHeaderColumn
            dataField='first_name'
            width='120px'
            dataAlign='center'
          >FIRST</TableHeaderColumn>
          <TableHeaderColumn
            dataField='last_name'
            width='120px'
            dataAlign='center'
          >LAST</TableHeaderColumn>
          <TableHeaderColumn
            dataField='phone_number'
            width='120px'
            dataAlign='center'
          >PHONE#</TableHeaderColumn>
          <TableHeaderColumn
            dataField='email'
            dataAlign='center'
            tdStyle={ { whiteSpace: 'normal' } }
          >EMAIL</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }


  buttonFormatter(cell, row){
    return (
      <Button
        bsStyle="link"
        onClick={ ()=> this.expandComponent(row)}
      >
        Details
      </Button>
    );
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


  hourFormatter(cell, row) {
    if (row.step === 'Queue' || row.step === 'Pick-up') {
      return row.time;
    } else {
      return (
        '---'
      );
    }
  }


  countdownFormatter(cell, row) {
    if (row.step === 'Queue' || row.step === 'Pick-up') {
      const Completionist = () => <span>Overdue!</span>;

      let time = moment(row.time, 'hh:mm A');
      time = moment(time, 'hh:mm A');
      time = time.format('HH:mm:ss')
      // console.log(time, '*********** time');

      let date = moment(row.created_at);
      date = moment(date);
      date = date.format('ddd, DD MMM YYYY')
      // console.log(date, '************* date');

      const dateTime = date + ' ' + time;
      // console.log(dateTime, '********* date and time');

      return <Countdown date={dateTime}>
        <Completionist />
      </Countdown>;

    } else {
      return (
        '---'
      );
    }
  }


  pickupFormatter(cell, row) {
    if (row.pickup === null) {
      return '---';
    } else {
      return row.pickup;
    }
  }

  washFormatter(cell, row) {
    if (row.wash_dry === null) {
      return '---';
    } else {
      return row.wash_dry;
    }
  }

  dropoffFormatter(cell, row) {
    if (row.dropoff === null) {
      return '---'
    } else {
      return row.dropoff;
    }
  }

  trClassFormat(row, rowIndex) {
    // row is the current row data
    return rowIndex % 2 === 0 ? "tr-odd" : "tr-even"; // return class name.
  }














  // ***************************  RENDER  ******************************
  render() {
    const venmoTitle = (
      <span className="venmo-title">
        <Image src="images/venmo-title.svg" />
        <small><em> - Pending payments</em></small>
      </span>
    );

    const laundryQueue = (<div>
      <h5><strong>LAUNDRY QUEUE </strong><small><em>- Work to be done!</em></small></h5>
    </div>);


    const myJobs = (<div>
      <h5><strong>ORDER STATUS</strong></h5>
    </div>);

    const completeTitle = (<div>
      <h5><strong>COMPLETED ORDERS</strong></h5>
    </div>);

    const venmoOptions = {
      insertBtn: this.venmoButtons,
      clearSearch: true,
      searchField: this.customSearch,
      expandBy: 'column',
      expandRowBgColor: '#daf5fd'
    };

    const queueOptions = {
      insertBtn: this.queueButtons,
      clearSearch: true,
      searchField: this.customSearch,
      expandBy: 'column',
      expandRowBgColor: '#daf5fd'
    };

    const activeOptions = {
      insertBtn: this.activeButtons,
      clearSearch: true,
      searchField: this.customSearch,
      expandBy: 'column',
      expandRowBgColor: '#daf5fd'
    };

    const completeOptions = {
      insertBtn: this.completeButtons,
      clearSearch: true,
      searchField: this.customSearch,
      expandBy: 'column',
      expandRowBgColor: '#daf5fd'
    };

    const selectVenmoRow = {
      mode: 'checkbox',
      clickToSelect: true,
      clickToExpand: true,
      onSelect: this.onVenmoRowSelect,
      onSelectAll: this.onVenmoSelectAll
    };


    const selectQueueRow = {
      mode: 'checkbox',
      clickToSelect: true,
      clickToExpand: true,
      onSelect: this.onQueueRowSelect,
      onSelectAll: this.onQueueSelectAll
      // bgColor: function(row, isSelect) {
      //   if (isSelect) {
      //     if (row.step === 'Queue') {
      //       return '#AED6F1';
      //     } else if (row.step === 'Pick-up') {
      //       return '#F9E79F';
      //     } else if (row.step === 'Cleaning') {
      //       return '#A3E4D7';
      //     } else if (row.step === 'Drop-off') {
      //       return '#ABEBC6';
      //     }
      //   }
      //
      //   return null;
      // }
    };

    const selectActiveRow = {
      mode: 'checkbox',
      clickToSelect: true,
      clickToExpand: true,
      onSelect: this.onActiveRowSelect,
      onSelectAll: this.onActiveSelectAll
    };

    const selectCompleteRow = {
      mode: 'checkbox',
      clickToSelect: true,
      clickToExpand: true,
      onSelect: this.onCompleteRowSelect,
      onSelectAll: this.onCompleteSelectAll
    };



    return (
      <div className="row admin-orders">
        <div className="col-sm-12">

          {/* MODAL */}
          <Popup
            title={this.state.modal.title}
            message={this.state.modal.message}
            showModal={this.state.showModal}
            close={this.close}
            action={this.state.modal.action}
          />


          <div className="row profile-header">
            <div className="col-sm-8 col-sm-offset-2">
              <div className="row">
                <div className="col-sm-12 text-center">
                  <i className="fa fa-id-card-o" aria-hidden="true"></i>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 text-center">
                  <div className="page-header">
                    <h1>ADMIN<small><em> - Manage Orders</em></small></h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="venmo">
                <Panel header={venmoTitle}>
                  <BootstrapTable ref='venmoTable' hover condensed
                    options={ venmoOptions }
                    bordered={ false }
                    data={ this.state.venmoOrders }
                    selectRow={ selectVenmoRow }
                    expandableRow={ this.isExpandableRow }
                    expandComponent={ this.expandComponent }
                    trClassName={this.trClassFormat}
                    pagination
                    insertRow
                    cleanSelected
                  >
                    <TableHeaderColumn
                      dataField='id'
                      isKey
                      width='70px'
                      dataAlign='center'
                      // filter={ { type: 'TextFilter', delay: 1000 } }
                      expandable={ false }
                    >ORDER#</TableHeaderColumn>
                    <TableHeaderColumn
                      dataField='created_at'
                      dataFormat={ this.startDateFormatter }
                      width='90px'
                      dataAlign='center'
                      expandable={ false }
                    >DATE</TableHeaderColumn>
                    <TableHeaderColumn
                      dataField='time'
                      width='90px'
                      dataAlign='center'
                      expandable={ false }
                      dataFormat={ this.hourFormatter }
                    >HOUR</TableHeaderColumn>
                    <TableHeaderColumn
                      dataField='time'
                      width='90px'
                      dataAlign='center'
                      expandable={ false }
                      dataFormat={ this.countdownFormatter }
                    >TIME</TableHeaderColumn>
                    <TableHeaderColumn
                      dataField='address'
                      expandable={ false }
                      width='150px'
                      dataAlign='center'
                      tdStyle={ { whiteSpace: 'normal' } }
                    >ADDRESS</TableHeaderColumn>
                    <TableHeaderColumn
                      dataField='total'
                      width='90px'
                      dataAlign='center'
                      expandable={ false }
                    >TOTAL</TableHeaderColumn>
                    <TableHeaderColumn
                      width='80px'
                      dataAlign='center'
                      dataFormat={this.buttonFormatter}
                    ></TableHeaderColumn>
                  </BootstrapTable>
                </Panel>
              </div>
            </div>
          </div>




          <div className="row">
            <div className="col-sm-12">

              {/* QUEUE TABLE */}
              <div className="queue">
                <Panel header={laundryQueue} bsStyle="primary">
                  <BootstrapTable ref='queueTable' hover condensed
                    options={ queueOptions }
                    bordered={ false }
                    data={ this.state.queueOrders }
                    selectRow={ selectQueueRow }
                    expandableRow={ this.isExpandableRow }
                    expandComponent={ this.expandComponent }
                    trClassName={this.trClassFormat}
                    pagination
                    insertRow
                    search
                    cleanSelected
                    >
                      <TableHeaderColumn
                        dataField='id'
                        isKey
                        width='70px'
                        dataAlign='center'
                        // filter={ { type: 'TextFilter', delay: 1000 } }
                        expandable={ false }
                      >ORDER#</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='created_at'
                        dataFormat={ this.startDateFormatter }
                        width='90px'
                        dataAlign='center'
                        expandable={ false }
                      >DATE</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='time'
                        width='90px'
                        dataAlign='center'
                        expandable={ false }
                        dataFormat={ this.hourFormatter }
                      >HOUR</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='time'
                        width='90px'
                        dataAlign='center'
                        expandable={ false }
                        dataFormat={ this.countdownFormatter }
                      >TIME</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='address'
                        expandable={ false }
                        width='150px'
                        dataAlign='center'
                        tdStyle={ { whiteSpace: 'normal' } }
                      >ADDRESS</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='step'
                        width='90px'
                        dataAlign='center'
                        expandable={ false }
                      >STEP</TableHeaderColumn>
                      <TableHeaderColumn
                        width='80px'
                        dataAlign='center'
                        dataFormat={this.buttonFormatter}
                      ></TableHeaderColumn>
                  </BootstrapTable>
                </Panel>
              </div>


              {/* TABS -> ACTIVE, COMPLETE */}
              <div className="my-jobs">
                <Panel header={myJobs} bsStyle="primary">
                  <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="my-jobs-tab">
                    <Tab eventKey={1} title="ACTIVE">
                      {/* TAB 1 -> ACTIVE */}
                      <BootstrapTable ref="activeTable" hover condensed
                        options={ activeOptions }
                        bordered={ false }
                        data={ this.state.activeOrders }
                        selectRow={ selectActiveRow }
                        expandableRow={ this.isExpandableRow }
                        expandComponent={ this.expandComponent }
                        trClassName={this.trClassFormat}
                        pagination
                        insertRow
                        search
                        cleanSelected
                      >
                        <TableHeaderColumn
                          dataField='id'
                          isKey
                          width='70px'
                          dataAlign='center'
                          // filter={ { type: 'TextFilter', delay: 1000 } }
                          expandable={ false }
                        >ORDER#</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='created_at'
                          dataFormat={ this.startDateFormatter }
                          width='90px'
                          dataAlign='center'
                          expandable={ false }
                        >DATE</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='time'
                          width='90px'
                          dataAlign='center'
                          expandable={ false }
                          dataFormat={ this.hourFormatter }
                        >HOUR</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='time'
                          width='90px'
                          dataAlign='center'
                          expandable={ false }
                          dataFormat={ this.countdownFormatter }
                        >TIME</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='address'
                          expandable={ false }
                          width='150px'
                          dataAlign='center'
                          tdStyle={ { whiteSpace: 'normal' } }
                        >ADDRESS</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='step'
                          width='90px'
                          dataAlign='center'
                          expandable={ false }
                        >STEP</TableHeaderColumn>
                        <TableHeaderColumn
                          width='80px'
                          dataAlign='center'
                          dataFormat={this.buttonFormatter}
                        ></TableHeaderColumn>
                      </BootstrapTable>
                    </Tab>

                    <Tab eventKey={2} title="MY ORDERS">
                      {/* TAB 2 -> MY JOBS */}
                      <BootstrapTable ref="activeTable" hover condensed
                        options={ activeOptions }
                        bordered={ false }
                        data={ this.state.myOrders }
                        selectRow={ selectActiveRow }
                        expandableRow={ this.isExpandableRow }
                        expandComponent={ this.expandComponent }
                        trClassName={this.trClassFormat}
                        pagination
                        insertRow
                        search
                        cleanSelected
                      >
                        <TableHeaderColumn
                          dataField='id'
                          isKey
                          width='70px'
                          dataAlign='center'
                          // filter={ { type: 'TextFilter', delay: 1000 } }
                          expandable={ false }
                        >ORDER#</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='created_at'
                          dataFormat={ this.startDateFormatter }
                          width='90px'
                          dataAlign='center'
                          expandable={ false }
                        >DATE</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='time'
                          width='90px'
                          dataAlign='center'
                          expandable={ false }
                          dataFormat={ this.hourFormatter }
                        >HOUR</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='time'
                          width='90px'
                          dataAlign='center'
                          expandable={ false }
                          dataFormat={ this.countdownFormatter }
                        >TIME</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='address'
                          expandable={ false }
                          width='150px'
                          dataAlign='center'
                          tdStyle={ { whiteSpace: 'normal' } }
                        >ADDRESS</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='step'
                          width='90px'
                          dataAlign='center'
                          expandable={ false }
                        >STEP</TableHeaderColumn>
                        <TableHeaderColumn
                          width='80px'
                          dataAlign='center'
                          dataFormat={this.buttonFormatter}
                        ></TableHeaderColumn>
                      </BootstrapTable>
                    </Tab>


                    <Tab eventKey={3} title="COMPLETED">
                      {/* TAB 3 -> COMPLETE TABLE */}
                      <BootstrapTable ref="completeTable" hover condensed
                        options={ completeOptions }
                        bordered={ false }
                        data={ this.state.completeOrders }
                        selectRow={ selectCompleteRow }
                        expandableRow={ this.isExpandableRow }
                        expandComponent={ this.expandComponent }
                        trClassName={this.trClassFormat}
                        pagination
                        search
                        cleanSelected
                      >

                        <TableHeaderColumn
                          dataField='id'
                          isKey
                          width='70px'
                          dataAlign='center'
                          // filter={ { type: 'TextFilter', delay: 1000 } }
                          expandable={ false }
                        >ORDER#</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='updated_at'
                          dataFormat={ this.endDateFormatter }
                          width='140px'
                          dataAlign='center'
                          expandable={ false }
                        >COMPLETED</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='customer_id'
                          width='60px'
                          dataAlign='center'
                        >USER#</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='first_name'
                          width='120px'
                          dataAlign='center'
                        >FIRST</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='last_name'
                          width='120px'
                          dataAlign='center'
                        >LAST</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='address'
                          expandable={ false }
                          width='150px'
                          dataAlign='center'
                          tdStyle={ { whiteSpace: 'normal' } }
                        >ADDRESS</TableHeaderColumn>
                        <TableHeaderColumn
                          width='80px'
                          dataAlign='center'
                          dataFormat={this.buttonFormatter}
                        ></TableHeaderColumn>
                      </BootstrapTable>
                    </Tab>
                  </Tabs>
                </Panel>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default withRouter(AdminOrders);

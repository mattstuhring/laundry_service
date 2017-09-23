import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import { Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel, Table, Tabs, Tab, Checkbox, Radio } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn, InsertButton, DeleteButton} from 'react-bootstrap-table';
import moment from 'moment';
import Popup from 'Popup';
import Countdown from 'react-countdown-now';




class AdminProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      orderId: null,
      taskId: null,
      table: '',
      firstName: '',
      orderStep: '',
      queueOrders: [],
      completeOrders: [],
      activeOrders: [],
      selectedQueueOrders: [],
      selectedActiveOrders: [],
      selectedCompleteOrders: [],
      selectedEmployees: [],
      selectedCustomers: [],
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
    this.openRemoveOrder = this.openRemoveOrder.bind(this);
    this.openStepBack = this.openStepBack.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleUserAccess = this.handleUserAccess.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
    this.handleRemoveOrder = this.handleRemoveOrder.bind(this);
    this.handleStepBack = this.handleStepBack.bind(this);
    this.queueButtons = this.queueButtons.bind(this);
    this.activeButtons = this.activeButtons.bind(this);
    this.completeButtons = this.completeButtons.bind(this);
    this.employeeButtons = this.employeeButtons.bind(this);
    this.customerButtons = this.customerButtons.bind(this);
    this.onQueueRowSelect = this.onQueueRowSelect.bind(this);
    this.onQueueSelectAll = this.onQueueSelectAll.bind(this);
    this.onActiveRowSelect = this.onActiveRowSelect.bind(this);
    this.onActiveSelectAll = this.onActiveSelectAll.bind(this);
    this.onCompleteRowSelect = this.onCompleteRowSelect.bind(this);
    this.onCompleteSelectAll = this.onCompleteSelectAll.bind(this);
    this.onEmployeeRowSelect = this.onEmployeeRowSelect.bind(this);
    this.onEmployeeSelectAll = this.onEmployeeSelectAll.bind(this);
    this.onCustomerRowSelect = this.onCustomerRowSelect.bind(this);
    this.onCustomerSelectAll = this.onCustomerSelectAll.bind(this);
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
                activeOrders: res.data[2],
                selectedActiveOrders: [],
                selectedQueueOrders: [],
                selectedCompleteOrders: [],
                selectedEmployees: [],
                selectedCustomers: []
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
    const { selectedQueueOrders } = this.state;
    const check = 'active';

    axios.put('/api/admin', {selectedQueueOrders, check})
      .then((r) => {
        this.refs.queueTable.cleanSelected();

        this.refs.queueTable.setState({
          selectedRowKeys: []
        });

        return axios.get('/api/admin')
          .then((res) => {

            this.setState({
              queueOrders: res.data[0],
              completeOrders: res.data[1],
              activeOrders: res.data[2],
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

    axios.post('/api/admin', { selectedActiveOrders })
      .then((r) => {
        this.refs.activeTable.cleanSelected();
        this.refs.activeTable.setState({
          selectedRowKeys: []
        });

        return axios.get('/api/admin')
          .then((res) => {

            this.setState({
              showModal: false,
              queueOrders: res.data[0],
              completeOrders: res.data[1],
              activeOrders: res.data[2],
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
    }

    axios.put('/api/adminDeleteOrder', {selectedOrders})
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
        }

        return axios.get('/api/admin')
          .then((res) => {
            this.setState({
              showModal: false,
              queueOrders: res.data[0],
              completeOrders: res.data[1],
              activeOrders: res.data[2],
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

    axios.put('/api/adminRemoveOrder', { selectedOrders })
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

        return axios.get(`/api/admin`)
          .then((res) => {
            this.setState({
              showModal: false,
              queueOrders: res.data[0],
              completeOrders: res.data[1],
              activeOrders: res.data[2],
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



  handleRemoveUser() {
    const { table } = this.state;
    const { selectedEmployees, selectedCustomers } = this.state;
    let selectedUsers;

    if (table === 'employee') {
      selectedUsers = selectedEmployees;
    } else if (table === 'customer') {
      selectedUsers = selectedCustomers;
    }

    axios.put('/api/adminDeleteUser', {selectedUsers})
      .then(() => {
        if (table === 'employee') {
          this.refs.employeeTable.cleanSelected();
          this.refs.employeeTable.setState({
            selectedRowKeys: []
          });
        } else if (table === 'customer') {
          this.refs.customerTable.cleanSelected();
          this.refs.customerTable.setState({
            selectedRowKeys: []
          });
        }

        return axios.get('/api/users')
          .then((r) => {
            this.setState({
              customers: r.data[0],
              employees: r.data[1],
              showModal: false,
              selectedEmployees: [],
              selectedCustomers: [],
              table: ''
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
    const { selectedCustomers } = this.state;

    axios.put('/api/users', {selectedCustomers})
      .then((res) => {
        this.refs.customerTable.cleanSelected();
        this.refs.customerTable.setState({
          selectedRowKeys: []
        });

        return axios.get('/api/users')
          .then((r) => {
            this.setState({
              customers: r.data[0],
              employees: r.data[1],
              showModal: false,
              selectedCustomers: []
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


  openActive() {
    this.setState({
      showModal: true,
      modal: {
        title: 'Job:',
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
        title: 'Job:',
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
        title: 'Job:',
        message: 'Whoops! Put order back into the queue?',
        action: this.handleStepBack
      }
    });
  }


  openComplete() {
    this.setState({
      showModal: true,
      modal: {
        title: 'Job:',
        message: 'Did you complete the job(s)?',
        action: this.handleComplete
      }
    });
  }


  openRemoveUser(tableName) {
    this.setState({
      showModal: true,
      table: tableName,
      modal: {
        title: 'Job:',
        message: 'Warning: You are about to delete this account?',
        action: this.handleRemoveUser
      }
    });
  }


  openAccess() {
    this.setState({
      showModal: true,
      modal: {
        title: 'Job:',
        message: 'Granting EMPLOYEE access?',
        action: this.handleUserAccess
      }
    });
  }



  queueButtons() {
  	return (
      <div>
        <Button
          bsStyle="success"
          bsSize="xsmall"
          onClick={() => this.openActive()}
        >
          <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
          Accept
        </Button>
        <Button
          bsStyle="danger"
          bsSize="xsmall"
          onClick={() => this.openRemoveOrder('queue')}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          Delete
        </Button>
        <Button
          bsStyle="warning"
          bsSize="xsmall"
          onClick={() => this.openStepBack('queue')}
        >
          <span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
          Go Back
        </Button>
      </div>
    );
  }



  activeButtons() {
    return (
      <div>
        <Button
          bsStyle="success"
          bsSize="xsmall"
          onClick={() => this.openComplete()}
        >
          <span className="glyphicon glyphicon-check" aria-hidden="true"></span>
          Complete
        </Button>
        <Button
          bsStyle="danger"
          bsSize="xsmall"
          onClick={() => this.openRemoveOrder('active')}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          Delete
        </Button>
        <Button
          bsStyle="warning"
          bsSize="xsmall"
          onClick={() => this.openStepBack('active')}
        >
          <span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
          Go Back
        </Button>
      </div>
    );
  }



  completeButtons() {
    return (
      <div>
        <Button
          bsStyle="danger"
          bsSize="xsmall"
          onClick={() => this.openRemoveOrder('complete')}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          Delete
        </Button>
      </div>
    );
  }



  employeeButtons() {
    return (
      <div>
        <Button
          bsStyle="danger"
          bsSize="xsmall"
          onClick={() => this.openRemoveUser('employee')}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          Delete
        </Button>
      </div>
    );
  }



  customerButtons() {
    return (
      <div>
        <Button
          bsStyle="warning"
          bsSize="xsmall"
          onClick={() => this.openAccess()}
        >
          <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
          Access
        </Button>
        <Button
          bsStyle="danger"
          bsSize="xsmall"
          onClick={() => this.openRemoveUser('customer')}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          Delete
        </Button>
      </div>
    );
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



  onEmployeeRowSelect(row, isSelected, e) {
    let arr = Object.assign([], this.state.selectedEmployees);

    if (isSelected) {
      arr.push(row);
      this.setState({selectedEmployees: arr});
    }
    else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === row.id) {
          arr.splice(i, 1);
        }
      }

      this.setState({ selectedEmployees: arr});
    }
  }


  onEmployeeSelectAll(isSelected, rows) {
    let arr = Object.assign([], this.state.selectedEmployees);

    if (isSelected) {
      for (let i = 0; i < rows.length; i++) {
        arr.push(rows[i]);
      }

      this.setState({selectedEmployees: arr});
    } else {
      this.setState({selectedEmployees: []});
    }
  }


  onCustomerRowSelect(row, isSelected, e) {
    let arr = Object.assign([], this.state.selectedCustomers);

    if (isSelected) {
      arr.push(row);
      this.setState({selectedCustomers: arr});
    }
    else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === row.id) {
          arr.splice(i, 1);
        }
      }

      this.setState({ selectedCustomers: arr});
    }
  }


  onCustomerSelectAll(isSelected, rows) {
    let arr = Object.assign([], this.state.selectedCustomers);

    if (isSelected) {
      for (let i = 0; i < rows.length; i++) {
        arr.push(rows[i]);
      }

      this.setState({selectedCustomers: arr});
    } else {
      this.setState({selectedCustomers: []});
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
            dataField='pickup'
            width='70px'
            dataAlign='center'
            dataFormat={this.pickupFormatter}
          >Pick-up</TableHeaderColumn>
          <TableHeaderColumn
            dataField='wash_dry'
            width='80px'
            dataAlign='center'
            dataFormat={this.washFormatter}
          >Clean</TableHeaderColumn>
          <TableHeaderColumn
            dataField='dropoff'
            width='80px'
            dataAlign='center'
            dataFormat={this.dropoffFormatter}
          >Drop-off</TableHeaderColumn>
          <TableHeaderColumn
            dataField='total'
            width='80px'
            dataAlign='center'
          >Total</TableHeaderColumn>
          <TableHeaderColumn
            dataField='instructions'
            dataAlign='center'
            tdStyle={ { whiteSpace: 'normal' } }
          >Instructions</TableHeaderColumn>
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
          >First</TableHeaderColumn>
          <TableHeaderColumn
            dataField='last_name'
            width='120px'
            dataAlign='center'
          >Last</TableHeaderColumn>
          <TableHeaderColumn
            dataField='phone_number'
            width='120px'
            dataAlign='center'
          >Phone#</TableHeaderColumn>
          <TableHeaderColumn
            dataField='email'
            dataAlign='center'
            tdStyle={ { whiteSpace: 'normal' } }
          >Email</TableHeaderColumn>
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
      const date = moment(row.created_at).format('MM-DD-YYYY');
      let now = date + ' ' + row.time;

      return (
        <Countdown date={now}>
          <Completionist />
        </Countdown>
      );
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

    const queueOptions = {
      insertBtn: this.queueButtons,
      clearSearch: true,
      searchField: this.customSearch,
      expandBy: 'column',
      expandRowBgColor: '#337ab7'
    };

    const activeOptions = {
      insertBtn: this.activeButtons,
      clearSearch: true,
      searchField: this.customSearch,
      expandBy: 'column',
      expandRowBgColor: '#337ab7'
    };

    const completeOptions = {
      insertBtn: this.completeButtons,
      clearSearch: true,
      searchField: this.customSearch,
      expandBy: 'column',
      expandRowBgColor: '#337ab7'
    };

    const employeeOptions = {
      insertBtn: this.employeeButtons,
      clearSearch: true,
      searchField: this.customSearch
    };

    const customerOptions = {
      insertBtn: this.customerButtons,
      clearSearch: true,
      searchField: this.customSearch
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

    const selectEmployeeRow = {
      mode: 'checkbox',
      clickToSelect: true,
      onSelect: this.onEmployeeRowSelect,
      onSelectAll: this.onEmployeeSelectAll
    };

    const selectCustomerRow = {
      mode: 'checkbox',
      clickToSelect: true,
      onSelect: this.onCustomerRowSelect,
      onSelectAll: this.onCustomerSelectAll
    };


    return (
      <div className="row admin-profile">
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
              <div className="page-header text-center">
                <h2>Dashboard</h2>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">

              {/* ALL TABLE */}
              <div className="page-header">
                <h3>Welcome, <small>Admin</small>!</h3>
              </div>

              {/* QUEUE TABLE */}
              <div className="queue">
                <Panel header="Laundry Queue" bsStyle="primary">
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
                        filter={ { type: 'TextFilter', delay: 1000 } }
                        expandable={ false }
                      >Order#</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='created_at'
                        dataFormat={ this.startDateFormatter }
                        width='90px'
                        dataAlign='center'
                        expandable={ false }
                      >Date</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='time'
                        width='90px'
                        dataAlign='center'
                        expandable={ false }
                        dataFormat={ this.hourFormatter }
                      >Hour</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='time'
                        width='90px'
                        dataAlign='center'
                        expandable={ false }
                        dataFormat={ this.countdownFormatter }
                      >Time</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='address'
                        expandable={ false }
                        dataAlign='center'
                        tdStyle={ { whiteSpace: 'normal' } }
                      >Address</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='step'
                        width='90px'
                        dataAlign='center'
                        expandable={ false }
                      >Step</TableHeaderColumn>
                      <TableHeaderColumn
                        width='80px'
                        dataAlign='center'
                        dataFormat={this.buttonFormatter}
                      ></TableHeaderColumn>
                  </BootstrapTable>
                </Panel>
              </div>


              {/* ORDERS */}
              <Panel header="Active Jobs" bsStyle="primary">
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
                  <Tab eventKey={1} title="Active">
                    {/* ACTIVE ORDERS */}
                    <div className="active">
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
                          filter={ { type: 'TextFilter', delay: 1000 } }
                          expandable={ false }
                        >Order#</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='created_at'
                          dataFormat={ this.startDateFormatter }
                          width='90px'
                          dataAlign='center'
                          expandable={ false }
                        >Date</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='time'
                          width='90px'
                          dataAlign='center'
                          expandable={ false }
                          dataFormat={ this.hourFormatter }
                        >Hour</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='time'
                          width='90px'
                          dataAlign='center'
                          expandable={ false }
                          dataFormat={ this.countdownFormatter }
                        >Time</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='address'
                          expandable={ false }
                          dataAlign='center'
                          tdStyle={ { whiteSpace: 'normal' } }
                        >Address</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='step'
                          width='90px'
                          dataAlign='center'
                          expandable={ false }
                        >Step</TableHeaderColumn>
                        <TableHeaderColumn
                          width='80px'
                          dataAlign='center'
                          dataFormat={this.buttonFormatter}
                        ></TableHeaderColumn>
                      </BootstrapTable>
                    </div>
                  </Tab>
                  <Tab eventKey={2} title="Complete">

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
                        filter={ { type: 'TextFilter', delay: 1000 } }
                        expandable={ false }
                      >Order#</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='updated_at'
                        dataFormat={ this.endDateFormatter }
                        width='140px'
                        dataAlign='center'
                        expandable={ false }
                      >Completed</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='customer_id'
                        width='60px'
                        dataAlign='center'
                      >User#</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='first_name'
                        width='120px'
                        dataAlign='center'
                      >First</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='last_name'
                        width='120px'
                        dataAlign='center'
                      >Last</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='address'
                        expandable={ false }
                        dataAlign='center'
                        tdStyle={ { whiteSpace: 'normal' } }
                      >Address</TableHeaderColumn>
                      <TableHeaderColumn
                        width='80px'
                        dataAlign='center'
                        dataFormat={this.buttonFormatter}
                      ></TableHeaderColumn>
                    </BootstrapTable>
                  </Tab>
                </Tabs>
              </Panel>











              {/* USERS */}
              <Panel header="Users" bsStyle="primary">
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
                  <Tab eventKey={1} title="Employees">

                    {/* EMPLOYEES TABLE */}
                    <BootstrapTable ref="employeeTable" striped hover condensed
                      options={ employeeOptions }
                      bordered={ false }
                      data={ this.state.employees }
                      selectRow={ selectEmployeeRow }
                      bodyContainerClass='table-body-container'
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
                        filter={ { type: 'TextFilter', delay: 1000 } }
                      >User#</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='first_name'
                        // width='100px'
                      >First</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='last_name'
                      >Last</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='email'
                        // width='60px'
                      >Email</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='phone_number'
                        // width='60px'
                      >Contact</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='created_at'
                        dataFormat={ this.startDateFormatter }
                        width='100px'
                      >Date</TableHeaderColumn>
                    </BootstrapTable>
                  </Tab>
                  <Tab eventKey={2} title="Customers">


                    {/* CUSTOMERS TABLE */}
                    <BootstrapTable ref="customerTable" striped hover condensed
                      options={ customerOptions }
                      bordered={ false }
                      data={ this.state.customers }
                      selectRow={ selectCustomerRow }
                      bodyContainerClass='table-body-container'
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
                        filter={ { type: 'TextFilter', delay: 1000 } }
                      >User#</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='first_name'
                        // width='100px'
                      >First</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='last_name'
                      >Last</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='address'
                        // width='60px'
                      >Address</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='email'
                        // width='60px'
                      >Email</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='phone_number'
                        // width='60px'
                      >Contact</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='created_at'
                        dataFormat={ this.startDateFormatter }
                        width='100px'
                      >Date</TableHeaderColumn>
                    </BootstrapTable>
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

export default withRouter(AdminProfile);

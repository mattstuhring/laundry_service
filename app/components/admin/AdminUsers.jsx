import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import { Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel, Table, Tabs, Tab, Checkbox, Radio } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn, InsertButton, DeleteButton} from 'react-bootstrap-table';
import moment from 'moment';
import Popup from 'Popup';
import Countdown from 'react-countdown-now';




class AdminUsers extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      table: '',
      firstName: '',
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
    this.openRemoveUser = this.openRemoveUser.bind(this);
    this.handleUserAccess = this.handleUserAccess.bind(this);
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
    this.employeeButtons = this.employeeButtons.bind(this);
    this.customerButtons = this.customerButtons.bind(this);
    this.onEmployeeRowSelect = this.onEmployeeRowSelect.bind(this);
    this.onEmployeeSelectAll = this.onEmployeeSelectAll.bind(this);
    this.onCustomerRowSelect = this.onCustomerRowSelect.bind(this);
    this.onCustomerSelectAll = this.onCustomerSelectAll.bind(this);
    this.startDateFormatter = this.startDateFormatter.bind(this);
    this.endDateFormatter = this.endDateFormatter.bind(this);
    this.customSearch = this.customSearch.bind(this);
  }


  componentWillMount() {
    if (localStorage.length > 0) {
      const user = JSON.parse( localStorage.getItem( 'user' ) );
      const token = user.token;

      axios.get('/api/authAdmin', { headers: {token} })
        .then((res) => {
          const data = res.data[0];
          this.setState({firstName: data.firstName});

          return axios.get('/api/users', { headers: {token} })
            .then((r) => {
              this.setState({
                customers: r.data[0],
                employees: r.data[1],
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
          browserHistory.push('/login');
        });
    } else {
      browserHistory.push('/login');
    }
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

    if (localStorage.length > 0) {
      const user = JSON.parse( localStorage.getItem( 'user' ) );
      const token = user.token;

      axios.put('/api/adminDeleteUser', {selectedUsers}, { headers: {token} })
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

          return axios.get('/api/users', { headers: {token} })
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
    } else {
      browserHistory.push('/login');
    }
  }





  handleUserAccess() {
    const { selectedCustomers } = this.state;

    if (localStorage.length > 0) {
      const user = JSON.parse( localStorage.getItem( 'user' ) );
      const token = user.token;

      axios.put('/api/users', {selectedCustomers}, { headers: {token} })
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
    } else {
      browserHistory.push('/login');
    }
  }



  close() {
    this.setState({ showModal: false });
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




  employeeButtons() {
    return (
      <div>
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={() => this.openRemoveUser('employee')}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          {' '}Delete User
        </Button>
      </div>
    );
  }



  customerButtons() {
    return (
      <div>
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={() => this.openRemoveUser('customer')}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          {' '}Delete User
        </Button>
        {' '}
        <Button
          bsStyle="warning"
          bsSize="small"
          onClick={() => this.openAccess()}
        >
          <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
          {' '}Access
        </Button>
      </div>
    );
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









  // ***************************  RENDER  ******************************
  render() {
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
      <div className="row admin-users">
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
                  <i className="fa fa-users" aria-hidden="true"></i>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 text-center">
                  <div className="page-header">
                    <h1>ADMIN<small><em> - Manage Users</em></small></h1>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* EMPLOYEES */}
          <div className="row">
            <div className="col-sm-12">

              {/* EMPLOYEES TABLE */}
              <div className="employee">
                <Panel header="EMPLOYEES" bsStyle="primary">
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
                      dataAlign='center'
                      width='90px'
                    >First</TableHeaderColumn>
                    <TableHeaderColumn
                      dataField='last_name'
                      dataAlign='center'
                      width="90px"
                    >Last</TableHeaderColumn>
                    <TableHeaderColumn
                      dataField='email'
                      dataAlign='center'
                      width='150px'
                      tdStyle={ { whiteSpace: 'normal' } }
                    >Email</TableHeaderColumn>
                    <TableHeaderColumn
                      dataField='phone_number'
                      dataAlign='center'
                      width='110px'
                    >Contact</TableHeaderColumn>
                    <TableHeaderColumn
                      dataField='created_at'
                      dataAlign='center'
                      dataFormat={ this.startDateFormatter }
                      width='100px'
                    >Date</TableHeaderColumn>
                  </BootstrapTable>
                </Panel>
              </div>
            </div>
          </div>




          {/* CUSTOMERS TABLE */}
          <div className="customer">
            <Panel header="CUSTOMERS" bsStyle="primary">
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
                  dataAlign='center'
                  width='90px'
                >First</TableHeaderColumn>
                <TableHeaderColumn
                  dataField='last_name'
                  dataAlign='center'
                  width="90px"
                >Last</TableHeaderColumn>
                <TableHeaderColumn
                  dataField='address'
                  width='150px'
                  dataAlign='center'
                  tdStyle={ { whiteSpace: 'normal' } }
                >Address</TableHeaderColumn>
                <TableHeaderColumn
                  dataField='email'
                  dataAlign='center'
                  width='150px'
                  tdStyle={ { whiteSpace: 'normal' } }
                >Email</TableHeaderColumn>
                <TableHeaderColumn
                  dataField='phone_number'
                  dataAlign='center'
                  width='110px'
                >Contact</TableHeaderColumn>
                <TableHeaderColumn
                  dataField='created_at'
                  dataAlign='center'
                  dataFormat={ this.startDateFormatter }
                  width='100px'
                >Date</TableHeaderColumn>
              </BootstrapTable>
            </Panel>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(AdminUsers);

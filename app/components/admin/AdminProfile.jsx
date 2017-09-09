import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import { Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel, Table, Tabs, Tab, Checkbox, Radio } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn, InsertButton, DeleteButton} from 'react-bootstrap-table';
import moment from 'moment';
import Popup from 'Popup';




class AdminProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      orderId: null,
      taskId: null,
      firstName: '',
      orderStep: '',
      queueOrders: [],
      completeOrders: [],
      selectedQueueOrders: [],
      selectedActiveOrders: [],
      activeOrders: [],
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
    this.handleActive = this.handleActive.bind(this);
    this.handleUserAccess = this.handleUserAccess.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
    this.handleRemoveOrder = this.handleRemoveOrder.bind(this);
    this.handleStepBack = this.handleStepBack.bind(this);
    this.queueButtons = this.queueButtons.bind(this);
    this.onQueueRowSelect = this.onQueueRowSelect.bind(this);
    this.onQueueSelectAll = this.onQueueSelectAll.bind(this);
    this.onActiveRowSelect = this.onActiveRowSelect.bind(this);
    this.onActiveSelectAll = this.onActiveSelectAll.bind(this);
    this.dateFormatter = this.dateFormatter.bind(this);
    this.activeButtons = this.activeButtons.bind(this);
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
    })
    .catch((err) => {
      console.log(err);
      browserHistory.push('/login');
    });
  }




























  handleActive() {
    const { selectedQueueOrders } = this.state;
    const check = 'active';
    console.log(selectedQueueOrders, '*************** selected orders');

    axios.put('/api/admin', {selectedQueueOrders, check})
      .then((r) => {

        this.refs.queueTable.setState({
          selectedRowKeys: []
        });

        return axios.get('/api/admin')
          .then((res) => {
            console.log(res.data, '************  data');

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
    console.log(selectedActiveOrders, '********** complete');

    axios.post('/api/admin', { selectedActiveOrders })
      .then((r) => {
        this.refs.activeTable.setState({
          selectedRowKeys: []
        });

        return axios.get('/api/admin')
          .then((res) => {
            console.log(res.data, '********* complete data');

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
















  handleRemoveUser() {
    const { userId } = this.state;

    axios.delete(`/api/users/${userId}`)
      .then(() => {
        return axios.get('/api/users')
          .then((r) => {
            this.setState({
              customers: r.data[0],
              employees: r.data[1],
              showModal: false
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



  handleRemoveOrder() {
    const { orderId } = this.state;
    const { selectedOrders } = this.state;

    // for (let i = 0; i < selectedOrders.length; i++) {
    //
    //   axios.delete(`/api/customerOrders/${selectedOrders[i].id}`)
    //     .then((r) => {
    //       console.log(r);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       return;
    //     })
    // }
    //
    // axios.get('/api/admin')
    //   .then((res) => {
    //     this.setState({
    //       showModal: false,
    //       queueOrders: res.data[0],
    //       completeOrders: res.data[1],
    //       activeOrders: res.data[2],
    //       selectedOrders: []
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }



  handleStepBack() {
    const { selectedOrders } = this.state;

    axios.put('/api/adminRemove', { selectedOrders })
      .then((r) => {
        return axios.get(`/api/admin`)
          .then((res) => {
            this.setState({
              showModal: false,
              queueOrders: res.data[0],
              completeOrders: res.data[1],
              activeOrders: res.data[2],
              selectedOrders: []
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



  handleUserAccess() {
    const { userId } = this.state;

    axios.put('/api/users', {userId})
      .then((res) => {
        console.log(res, '****** res');

        return axios.get('/api/users')
          .then((r) => {
            this.setState({
              customers: r.data[0],
              employees: r.data[1],
              showModal: false
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



  openRemoveOrder() {
    this.setState({
      showModal: true,
      modal: {
        title: 'Job:',
        message: 'Warning: You are about to delete this order?',
        action: this.handleRemoveOrder
      }
    });
  }



  openRemoveUser() {
    this.setState({
      showModal: true,
      userId: id,
      modal: {
        title: 'Job:',
        message: 'Warning: You are about to delete this account?',
        action: this.handleRemoveUser
      }
    });
  }



  openStepBack() {
    this.setState({
      showModal: true,
      modal: {
        title: 'Job:',
        message: 'Whoops! Put order back into the queue?',
        action: this.handleStepBack
      }
    });
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



  openAccess(id) {
    this.setState({
      showModal: true,
      userId: id,
      orderStep: status,
      modal: {
        title: 'Job:',
        message: 'Granting employee access?',
        action: this.handleUserAccess
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
          onClick={() => this.openRemoveOrder()}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          Delete
        </Button>
        <Button
          bsStyle="warning"
          bsSize="xsmall"
          onClick={() => this.openStepBack()}
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
          onClick={() => this.openRemoveOrder()}
        >
          <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          Delete
        </Button>
        <Button
          bsStyle="warning"
          bsSize="xsmall"
          onClick={() => this.openStepBack()}
        >
          <span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
          Go Back
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



  dateFormatter(cell, row) {
    const startDate = moment(row.created_at).format('L');
    return startDate;
  }






















  // ***************************  RENDER  ******************************
  render() {
    console.log(this.state.selectedQueueOrders, '******* select q orders');
    console.log(this.state.selectedActiveOrders, '******* select a orders');

    const queueOptions = {
      insertBtn: this.queueButtons
    };

    const activeOptions = {
      insertBtn: this.activeButtons
    };

    const selectQueueRow = {
      mode: 'checkbox',
      clickToSelect: true,
      onSelect: this.onQueueRowSelect,
      onSelectAll: this.onQueueSelectAll
    };

    const selectActiveRow = {
      mode: 'checkbox',
      clickToSelect: true,
      onSelect: this.onActiveRowSelect,
      onSelectAll: this.onActiveSelectAll
    };


    // const data = [
    //   {id: 1},
    //   {id: 2},
    //   {id: 3},
    //   {id: 4},
    //   {id: 5},
    //   {id: 6},
    //   {id: 7},
    //   {id: 8},
    //   {id: 9},
    //   {id: 10},
    //   {id: 11},
    //   {id: 12},
    //   {id: 13},
    //   {id: 14},
    //   {id: 15},
    //   {id: 16},
    //   {id: 17},
    //   {id: 18},
    //   {id: 19},
    //   {id: 20},
    //   {id: 21},
    //   {id: 22},
    //   {id: 23},
    //   {id: 24},
    //   {id: 25},
    //   {id: 26},
    //   {id: 27},
    //   {id: 28},
    //   {id: 29},
    //   {id: 30}
    // ];

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
              <div className="page-header">
                <h2>Welcome, <small>Admin</small>!</h2>
              </div>
            </div>
          </div>



          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">

              {/* ALL USERS TABLE */}
              <div className="page-header text-center">
                <h1>Dashboard</h1>
              </div>



























              {/* QUEUE TABLE */}
              <Panel header="Laundry Queue" bsStyle="primary">
                <BootstrapTable ref='queueTable' striped condensed
                  options={ queueOptions }
                  bordered={ false }
                  data={ this.state.queueOrders }
                  // data={ data }
                  selectRow={ selectQueueRow }
                  bodyContainerClass='table-body-container'
                  pagination
                  insertRow
                >
                  <TableHeaderColumn
                    dataField='id'
                    isKey
                    width='50px'
                  >#</TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='created_at'
                    dataFormat={ this.dateFormatter }
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
                </BootstrapTable>
              </Panel>




























              {/* ORDERS */}
              <Panel header="Active Jobs" bsStyle="primary">
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
                  <Tab eventKey={1} title="Active">
                    {/* ACTIVE ORDERS */}
                    <BootstrapTable ref="activeTable" striped condensed
                      options={ activeOptions }
                      bordered={ false }
                      data={ this.state.activeOrders }
                      // data={ data }
                      selectRow={ selectActiveRow }
                      bodyContainerClass='table-body-container'
                      pagination
                      insertRow
                    >
                      <TableHeaderColumn
                        dataField='id'
                        isKey
                        width='50px'
                      >#</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='created_at'
                        dataFormat={ this.dateFormatter }
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
                    </BootstrapTable>































                  </Tab>
                  <Tab eventKey={2} title="Complete">
                    {/* COMPLETE TABLE */}
                    <Table striped bordered condensed hover responsive>
                      <thead>
                        <tr className="text-center">
                          <th>#</th>
                          <th>Date</th>
                          <th>Address</th>
                          <th>Status</th>
                          <th>Payment</th>
                          <th>Amount</th>
                          <th>Completed</th>
                          <th style={{width: '100px'}}>Action</th>
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
                            <td className="text-center">
                              <Button
                                bsStyle="danger"
                                bsSize="xsmall"
                                onClick={() => this.openRemoveOrder(c.id)}
                              >
                                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                              </Button>
                            </td>
                          </tr>
                        })}
                      </tbody>
                    </Table>
                  </Tab>
                </Tabs>
              </Panel>

              {/* USERS */}
              <Panel>
                <div className="page-header">
                  <h3>Users</h3>
                </div>

                <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">

                  <Tab eventKey={1} title="Employees">
                    {/* EMPLOYEES TABLE */}
                    <Table striped bordered condensed hover responsive>
                      <thead>
                        <tr className="text-center">
                          <th>#</th>
                          <th>First</th>
                          <th>Last</th>
                          <th>Email</th>
                          <th>Contact</th>
                          <th>Start</th>
                          <th style={{width: '100px'}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>

                        {this.state.employees.map((e) => {
                          const startDate = moment(e.created_at).format('L');

                          return <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>{e.first_name}</td>
                            <td>{e.last_name}</td>
                            <td>{e.email}</td>
                            <td>{e.phone_number}</td>
                            <td>{startDate}</td>
                            <td className="text-center">
                              <Button
                                bsStyle="danger"
                                bsSize="xsmall"
                                onClick={() => this.openRemoveUser(e.id)}
                              >
                                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                              </Button>
                            </td>
                          </tr>
                        })}
                      </tbody>
                    </Table>
                  </Tab>
                  <Tab eventKey={2} title="Customers">
                    {/* CUSTOMERS TABLE */}
                    <Table striped bordered condensed hover responsive>
                      <thead>
                        <tr className="text-center">
                          <th>#</th>
                          <th>First</th>
                          <th>Last</th>
                          <th>Address</th>
                          <th>Email</th>
                          <th>Contact</th>
                          <th>Start</th>
                          <th style={{width: '100px'}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>

                        {this.state.customers.map((c) => {
                          const startDate = moment(c.created_at).format('L');

                          return <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.first_name}</td>
                            <td>{c.last_name}</td>
                            <td>{c.address}</td>
                            <td>{c.email}</td>
                            <td>{c.phone_number}</td>
                            <td>{startDate}</td>
                            <td className="text-center">
                              <Button
                                bsStyle="primary"
                                bsSize="xsmall"
                                onClick={() => this.openAccess(c.id)}
                              >
                                <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
                              </Button>
                              <Button
                                bsStyle="danger"
                                bsSize="xsmall"
                                onClick={() => this.openRemoveUser(c.id)}
                              >
                                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                              </Button>
                            </td>
                          </tr>
                        })}
                      </tbody>
                    </Table>
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

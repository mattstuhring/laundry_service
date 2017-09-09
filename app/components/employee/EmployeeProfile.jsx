import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron, Table, Button, Panel, Tabs, Tab} from 'react-bootstrap';
import moment from 'moment';
import Popup from 'Popup';
import {BootstrapTable, TableHeaderColumn, InsertButton} from 'react-bootstrap-table';


class EmployeeProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      orderId: null,
      taskId: null,
      firstName: '',
      orderStep: '',
      queueOrders: [],
      completeOrders: [],
      activeOrders: [],
      showModal: false,
      modal: {
        title: '',
        message: '',
        action: null
      }
    }

    this.close = this.close.bind(this);
    this.openActive = this.openActive.bind(this);
    this.openComplete = this.openComplete.bind(this);
    this.openRemove = this.openRemove.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.cellButton = this.cellButton.bind(this);
  }

  componentWillMount() {
    axios.get('/api/authEmployee')
    .then((res) => {
      const data = res.data[0];
      this.setState({firstName: data.firstName});

      return axios.get(`/api/employeeOrders`)
        .then((res) => {
          this.setState({
            queueOrders: res.data[0],
            completeOrders: res.data[1],
            activeOrders: res.data[2]
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
    const {orderId, orderStep, taskId } = this.state;
    const check = 'active';

    axios.put(`/api/employeeOrders`, {orderId, check, orderStep, taskId})
      .then((r) => {

        return axios.get(`/api/employeeOrders`)
          .then((res) => {
            this.setState({
              showModal: false,
              queueOrders: res.data[0],
              completeOrders: res.data[1],
              activeOrders: res.data[2]
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
    const { orderId, orderStep } = this.state;

    axios.post(`/api/employeeOrders/${orderId}/${orderStep}`)
      .then((r) => {
        return axios.get(`/api/employeeOrders`)
          .then((res) => {
            this.setState({
              showModal: false,
              queueOrders: res.data[0],
              completeOrders: res.data[1],
              activeOrders: res.data[2]
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


  handleRemove() {
    const { orderId, orderStep } = this.state;

    axios.delete(`/api/employeeOrders/${orderId}/${orderStep}`)
      .then((r) => {
        return axios.get(`/api/employeeOrders`)
          .then((res) => {
            this.setState({
              showModal: false,
              queueOrders: res.data[0],
              completeOrders: res.data[1],
              activeOrders: res.data[2]
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


  openActive(oId, status, tId) {
    this.setState({
      showModal: true,
      orderId: oId,
      taskId: tId,
      orderStep: status,
      modal: {
        title: 'Job:',
        message: 'Do you accept this order?',
        action: this.handleActive
      }
    });
  }

  openRemove(id, step) {
    this.setState({
      showModal: true,
      orderId: id,
      orderStep: step,
      modal: {
        title: 'Job:',
        message: 'Whoops! Put order back into the queue?',
        action: this.handleRemove
      }
    });
  }

  openComplete(id, step) {
    let message;
    if (step === 'Pick-up') {
      message = 'Did you pick up customers laundry?';
    } else if (step === 'Cleaning') {
      message = 'Did you clean the customers laundry?';
    } else if (step === 'Drop-off') {
      message = 'Did you drop-off customers laundry?';
    }

    this.setState({
      showModal: true,
      orderId: id,
      orderStep: step,
      modal: {
        title: 'Job:',
        message: message,
        action: this.handleComplete
      }
    });
  }

  close() {
    this.setState({ showModal: false });
  }


  cellButton(cell, row, enumObject, rowIndex) {
  	return (
      <Button
        bsStyle="success"
        bsSize="xsmall"
        onClick={() => this.openActive(row.id, row.step, row.task_id)}
      >
        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
      </Button>
    );
  }



  // ***************************  RENDER  *********************************
  render() {
    const { firstName } = this.state;

    const selectRowProp = {
      mode: 'checkbox'
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

    const options = {
      insertBtn: this.createCustomInsertButton
    };

    return (
      <div className="row employee-profile">
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
                <h2>Welcome, <small>{firstName}</small>!</h2>
              </div>
            </div>
          </div>

          <BootstrapTable data={ this.state.queueOrders } selectRow={ selectRowProp }>
            <TableHeaderColumn dataField='id' isKey>Product ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
            <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
          </BootstrapTable>


          {/* JOBS TABLE */}
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">
              <div className="page-header">
                <h2>Dashboard</h2>
              </div>

              <Panel>
                <BootstrapTable data={ this.state.queueOrders }>
                  <TableHeaderColumn
                    dataField='#'
                    isKey
                    width='50'
                  >id</TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='created_at'
                  >Date</TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='address'
                  >Address</TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='status'
                    width='60'
                  >Status</TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='step'
                    width='60'
                  >Step</TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='clean'
                    width='60'
                  >Clean</TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='fold'
                    width='60'
                  >Fold</TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='amount'
                    width='60'
                  >Loads</TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='instructions'
                  >Instructions</TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='action'
                    dataFormat={this.cellButton}
                    width='60'
                  >Action</TableHeaderColumn>
                </BootstrapTable>
              </Panel>


              <Panel header="Laundry Queue" bsStyle="primary">
                {/* QUEUE TABLE */}

                <table className="table table-striped">
                  <thead className="text-center">
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Step</th>
                      <th>Clean</th>
                      <th>Fold</th>
                      <th>Loads</th>
                      <th>Instructions</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {this.state.queueOrders.map((q) => {
                      const startDate = moment(q.created_at).format('L');
                      let clean, fold;

                      if (q.fold === true) {
                        fold = 'true';
                      } else {
                        fold = 'false'
                      }

                      if (q.clean === true) {
                        clean = 'true';
                      } else {
                        clean = 'false'
                      }

                      return <tr key={q.id}>
                        <td>{q.id}</td>
                        <td>{startDate}</td>
                        <td>{q.address}</td>
                        <td>{q.status}</td>
                        <td>{q.step}</td>
                        <td>{clean}</td>
                        <td>{fold}</td>
                        <td>{q.amount}</td>
                        <td>{q.instructions}</td>
                        <td className="text-center">
                          <Button
                            bsStyle="success"
                            bsSize="xsmall"
                            onClick={() => this.openActive(q.id, q.step, q.task_id)}
                          >
                            <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                          </Button>
                        </td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </Panel>







              {/* ORDERS */}
              <Panel header="My Jobs" bsStyle="primary">
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
                  <Tab eventKey={1} title="Active">
                    {/* ACTIVE ORDERS */}
                    <Table striped bordered condensed hover>
                      <thead className="text-center">
                        <tr>
                          <th>#</th>
                          <th>Date</th>
                          <th>Address</th>
                          <th>Status</th>
                          <th>Step</th>
                          <th>Clean</th>
                          <th>Fold</th>
                          <th>Loads</th>
                          <th>Instructions</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>

                        {this.state.activeOrders.map((a) => {
                          const startDate = moment(a.created_at).format('L');
                          let clean, fold;

                          if (a.fold === true) {
                            fold = 'true';
                          } else {
                            fold = 'false'
                          }

                          if (a.clean === true) {
                            clean = 'true';
                          } else {
                            clean = 'false'
                          }

                          return <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{startDate}</td>
                            <td>{a.address}</td>
                            <td>{a.status}</td>
                            <td>{a.step}</td>
                            <td>{clean}</td>
                            <td>{fold}</td>
                            <td>{a.amount}</td>
                            <td>{a.instructions}</td>
                            <td className="text-center">
                              <Button
                                bsStyle="success"
                                bsSize="xsmall"
                                onClick={() => this.openComplete(a.id, a.step)}
                              >
                                <span className="glyphicon glyphicon-check" aria-hidden="true"></span>
                              </Button>
                              <Button
                                bsStyle="danger"
                                bsSize="xsmall"
                                onClick={() => this.openRemove(a.id, a.step)}
                              >
                                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                              </Button>
                            </td>
                          </tr>
                        })}
                      </tbody>
                    </Table>
                  </Tab>
                  <Tab eventKey={2} title="Complete">
                    {/* COMPLETE TABLE */}
                    <Table striped bordered condensed hover>
                      <thead className="text-center">
                        <tr>
                          <th>#</th>
                          <th>Date</th>
                          <th>Address</th>
                          <th>Status</th>
                          <th>Payment</th>
                          <th>Amount</th>
                          <th>Completed</th>
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

export default withRouter(EmployeeProfile);

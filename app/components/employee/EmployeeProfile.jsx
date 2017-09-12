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
      selectedQueueOrders: [],
      selectedActiveOrders: [],
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
    this.queueButtons = this.queueButtons.bind(this);
    this.activeButtons = this.activeButtons.bind(this);
    this.onQueueRowSelect = this.onQueueRowSelect.bind(this);
    this.onQueueSelectAll = this.onQueueSelectAll.bind(this);
    this.onActiveRowSelect = this.onActiveRowSelect.bind(this);
    this.onActiveSelectAll = this.onActiveSelectAll.bind(this);
    this.startDateFormatter = this.startDateFormatter.bind(this);
    this.endDateFormatter = this.endDateFormatter.bind(this);
    this.customSearch = this.customSearch.bind(this);
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
    const { selectedQueueOrders } = this.state;
    const check = 'active';

    axios.put(`/api/employeeOrders`, {selectedQueueOrders, check})
      .then((r) => {
        this.refs.queueTable.cleanSelected();
        this.refs.queueTable.setState({
          selectedRowKeys: []
        });

        return axios.get(`/api/employeeOrders`)
          .then((res) => {
            this.setState({
              showModal: false,
              queueOrders: res.data[0],
              completeOrders: res.data[1],
              activeOrders: res.data[2],
              selectedQueueOrders: [],
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
    const { selectedActiveOrders } = this.state;

    axios.post('/api/employeeOrders/', {selectedActiveOrders})
      .then((r) => {
        this.refs.activeTable.cleanSelected();
        this.refs.activeTable.setState({
          selectedRowKeys: []
        });

        return axios.get(`/api/employeeOrders`)
          .then((res) => {
            this.setState({
              showModal: false,
              queueOrders: res.data[0],
              completeOrders: res.data[1],
              activeOrders: res.data[2],
              selectedActiveOrders: []
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

  openComplete() {
    this.setState({
      showModal: true,
      modal: {
        title: 'Job:',
        message: 'Did you complete the job(s)',
        action: this.handleComplete
      }
    });
  }

  close() {
    this.setState({ showModal: false });
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
          bsStyle="warning"
          bsSize="xsmall"
          // onClick={() => this.openStepBack('active')}
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
      this.setState({selectedQueueOrders: arr});
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

      this.setState({selectedQueueOrders: arr});
    } else {
      this.setState({selectedQueueOrders: []});
    }
  }


  onActiveRowSelect(row, isSelected, e) {
    let arr = Object.assign([], this.state.selectedActiveOrders);

    if (isSelected) {
      arr.push(row);
      this.setState({selectedActiveOrders: arr});
    }
    else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === row.id) {
          arr.splice(i, 1);
        }
      }

      this.setState({ selectedActiveOrders: arr});
    }
  }



  onActiveSelectAll(isSelected, rows) {
    let arr = Object.assign([], this.state.selectedActiveOrders);

    if (isSelected) {
      for (let i = 0; i < rows.length; i++) {
        arr.push(rows[i]);
      }

      this.setState({selectedActiveOrders: arr});
    } else {
      this.setState({selectedActiveOrders: []});
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
    const endDate = moment(row.created_at).format('L');
    return endDate;
  }






  // ***************************  RENDER  *********************************
  render() {
    const { firstName } = this.state;

    const queueOptions = {
      insertBtn: this.queueButtons,
      clearSearch: true,
      searchField: this.customSearch
    };

    const activeOptions = {
      insertBtn: this.activeButtons,
      clearSearch: true,
      searchField: this.customSearch
    };

    const completeOptions = {
      clearSearch: true,
      searchField: this.customSearch
    };

    const selectQueueRow = {
      mode: 'checkbox',
      clickToSelect: true,
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
      onSelect: this.onActiveRowSelect,
      onSelectAll: this.onActiveSelectAll
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




          {/* JOBS TABLE */}
          <div className="row">
            <div className="col-sm-10 col-sm-offset-1">
              <div className="page-header">
                <h2>Dashboard</h2>
              </div>

              {/* QUEUE TABLE */}
              <Panel header="Laundry Queue" bsStyle="primary">
                <BootstrapTable ref='queueTable' striped condensed
                  options={ queueOptions }
                  bordered={ false }
                  data={ this.state.queueOrders }
                  selectRow={ selectQueueRow }
                  bodyContainerClass='table-body-container'
                  pagination
                  insertRow
                  search
                  cleanSelected
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
                </BootstrapTable>
              </Panel>








              {/* ORDERS */}
              <Panel header="My Jobs" bsStyle="primary">
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
                  <Tab eventKey={1} title="Active">
                    {/* ACTIVE ORDERS */}
                    <BootstrapTable ref="activeTable" striped condensed
                      options={ activeOptions }
                      bordered={ false }
                      data={ this.state.activeOrders }
                      selectRow={ selectActiveRow }
                      bodyContainerClass='table-body-container'
                      pagination
                      insertRow
                      search
                      cleanSelected
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
                    </BootstrapTable>
                  </Tab>
                  <Tab eventKey={2} title="Complete">
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

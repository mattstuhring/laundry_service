import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import { Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel, Table, Tabs, Tab, Checkbox, Radio } from 'react-bootstrap';
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
      queueOrders: [],
      completeOrders: [],
      activeOrders: [],
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
    this.openActive = this.openActive.bind(this);
    this.openComplete = this.openComplete.bind(this);
    this.openRemoveOrder = this.openRemoveOrder.bind(this);
    this.openStepBack = this.openStepBack.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleRemoveOrder = this.handleRemoveOrder.bind(this);
    this.handleStepBack = this.handleStepBack.bind(this);
    this.queueButtons = this.queueButtons.bind(this);
    this.activeButtons = this.activeButtons.bind(this);
    this.completeButtons = this.completeButtons.bind(this);
    this.onQueueRowSelect = this.onQueueRowSelect.bind(this);
    this.onQueueSelectAll = this.onQueueSelectAll.bind(this);
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
    axios.get('/api/authAdmin')
    .then((res) => {
      const data = res.data[0];
      this.setState({firstName: data.firstName});

      return axios.get('/api/admin')
        .then((res) => {
          this.setState({
            queueOrders: res.data[0],
            completeOrders: res.data[1],
            activeOrders: res.data[2],
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
                    <h1>ADMIN<small><em> - Manage All Orders</em></small></h1>
                  </div>
                </div>
              </div>
            </div>
          </div>




          <div className="row">
            <div className="col-sm-12">

              {/* QUEUE TABLE */}
              <div className="queue">
                <Panel header="LAUNDRY QUEUE" bsStyle="primary">
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


              {/* TABS -> ACTIVE, COMPLETE */}
              <div className="my-jobs">
                <Panel header="ALL ACTIVE JOBS" bsStyle="primary">
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
                    </Tab>

                    <Tab eventKey={2} title="COMPLETED ORDERS">
                      {/* TAB 2 -> COMPLETE TABLE */}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(AdminOrders);

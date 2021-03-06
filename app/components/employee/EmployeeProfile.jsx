import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron, Table, Button, Panel, Tabs, Tab, Collapse} from 'react-bootstrap';
import moment from 'moment';
import Popup from 'Popup';
import {BootstrapTable, TableHeaderColumn, InsertButton} from 'react-bootstrap-table';
import Countdown from 'react-countdown-now';




class EmployeeProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      orderId: null,
      taskId: null,
      firstName: '',
      orderStep: '',
      table: '',
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
    this.openStepBack = this.openStepBack.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleStepBack = this.handleStepBack.bind(this);
    this.queueButtons = this.queueButtons.bind(this);
    this.activeButtons = this.activeButtons.bind(this);
    this.onQueueRowSelect = this.onQueueRowSelect.bind(this);
    this.onQueueSelectAll = this.onQueueSelectAll.bind(this);
    this.onActiveRowSelect = this.onActiveRowSelect.bind(this);
    this.onActiveSelectAll = this.onActiveSelectAll.bind(this);
    this.startDateFormatter = this.startDateFormatter.bind(this);
    this.endDateFormatter = this.endDateFormatter.bind(this);
    this.customSearch = this.customSearch.bind(this);
    this.isExpandableRow = this.isExpandableRow.bind(this);
    this.expandComponent = this.expandComponent.bind(this);
    this.expandCompleteComponent = this.expandCompleteComponent.bind(this);
    this.buttonFormatter = this.buttonFormatter.bind(this);
    this.buttonCompleteFormatter = this.buttonCompleteFormatter.bind(this);
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

      axios.get('/api/authEmployee', { headers: {token} })
        .then((res) => {
          const data = res.data[0];
          this.setState({firstName: data.firstName});

          return axios.get('/api/employeeOrders', { headers: {token} })
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
        });
    } else {
      browserHistory.push('/login');
    }
  }


  handleActive() {
    const { selectedQueueOrders } = this.state;
    const check = 'active';
    const user = JSON.parse( localStorage.getItem( 'user' ) );
    const token = user.token;

    axios.put(`/api/employeeOrders`, {selectedQueueOrders, check}, { headers: {token} })
      .then((r) => {
        this.refs.queueTable.cleanSelected();
        this.refs.queueTable.reset();
        this.refs.queueTable.setState({
          selectedRowKeys: []
        });

        return axios.get(`/api/employeeOrders`, { headers: {token} })
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
    const user = JSON.parse( localStorage.getItem( 'user' ) );
    const token = user.token;

    axios.post('/api/employeeOrders/', {selectedActiveOrders}, { headers: {token} })
      .then((r) => {
        this.refs.activeTable.cleanSelected();
        this.refs.activeTable.reset();
        this.refs.activeTable.setState({
          selectedRowKeys: []
        });

        return axios.get(`/api/employeeOrders`, { headers: {token} })
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


  handleStepBack() {
    const { selectedActiveOrders } = this.state;
    const user = JSON.parse( localStorage.getItem( 'user' ) );
    const token = user.token;

    axios.put('/api/employeeRemoveOrder', { selectedActiveOrders }, { headers: {token} })
      .then((r) => {
        this.refs.activeTable.cleanSelected();
        this.refs.activeTable.reset();
        this.refs.activeTable.setState({
          selectedRowKeys: []
        });

        return axios.get(`/api/employeeOrders`, { headers: {token} })
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


  openActive() {
    this.setState({
      showModal: true,
      modal: {
        title: 'JOB',
        message: 'Do you accept the job(s)?',
        action: this.handleActive
      }
    });
  }


  openComplete() {
    this.setState({
      showModal: true,
      modal: {
        title: 'JOBS',
        message: 'Did you complete the job(s)',
        action: this.handleComplete
      }
    });
  }


  openStepBack() {
    this.setState({
      showModal: true,
      modal: {
        title: 'JOBS',
        message: 'WHOOPS! Put order back into the laundry queue?',
        action: this.handleStepBack
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
          bsSize="small"
          onClick={() => this.openActive()}
        >
          <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
          {' '}Accept Job
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
          onClick={() => this.openStepBack()}
        >
          <span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
          {' '}Back to Queue
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
    const startDate = moment(row.created_at).format('MM-DD-YYYY');
    return startDate;
  }



  endDateFormatter(cell, row) {
    const endDate = moment(row.updated_at).format('L');
    return endDate;
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
        <BootstrapTable data={ [row] }
          condensed
        >
          <TableHeaderColumn
            isKey={ true }
            dataField='amount'
            width='60px'
            dataAlign='center'
          >LOADS</TableHeaderColumn>
          <TableHeaderColumn
            dataField='clean'
            width='90px'
            dataAlign='center'
            dataFormat={this.cleanFormatter}
          >WASH/DRY</TableHeaderColumn>
          <TableHeaderColumn
            dataField='fold'
            width='50px'
            dataAlign='center'
            dataFormat={this.foldFormatter}
          >FOLD</TableHeaderColumn>
          <TableHeaderColumn
            dataField='pickup'
            width='90px'
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
        <BootstrapTable data={ [row] }
          condensed
        >
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



  expandCompleteComponent(row) {
    return (
      <div className="expand-row">
        <BootstrapTable data={ [row] }
          condensed
        >
          <TableHeaderColumn
            isKey={ true }
            dataField='amount'
            width='60px'
            dataAlign='center'
          >LOADS</TableHeaderColumn>
          <TableHeaderColumn
            dataField='clean'
            width='90px'
            dataAlign='center'
            dataFormat={this.cleanFormatter}
          >WASH/DRY</TableHeaderColumn>
          <TableHeaderColumn
            dataField='fold'
            width='50px'
            dataAlign='center'
            dataFormat={this.foldFormatter}
          >FOLD</TableHeaderColumn>
          <TableHeaderColumn
            dataField='pickup'
            width='70px'
            dataAlign='center'
          >PICK-UP</TableHeaderColumn>
          <TableHeaderColumn
            dataField='wash_dry'
            width='80px'
            dataAlign='center'
          >CLEAN</TableHeaderColumn>
          <TableHeaderColumn
            dataField='dropoff'
            width='80px'
            dataAlign='center'
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
      </div>
    );
  }






  // ***************************  RENDER  *********************************
  render() {
    const { firstName } = this.state;

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

    const laundryQueue = (<div>
      <h5><strong>LAUNDRY QUEUE </strong><small><em>- Work to be done!</em></small></h5>
    </div>);


    const myJobs = (<div>
      <h5><strong>JOB & ORDER STATUS</strong></h5>
    </div>);





















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

          <div className="row profile-header">
            <div className="col-sm-8 col-sm-offset-2">
              <div className="row">
                <div className="col-sm-12 text-center">
                  <div className="page-header">
                    <h1>DASHBOARD</h1>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 text-center">
                  <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                  <p>{firstName}</p>
                </div>
              </div>
            </div>
          </div>


          {/* JOBS TABLE */}
          <div className="row queue-wrapper">
            <div className="col-sm-12">
              <div className="page-header">
                <h2>Welcome, <small><em>team member!</em></small></h2>
              </div>

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
                    search={true}
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
                      width="150px"
                      expandable={ false }
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
                    <Tab eventKey={1} title="MY JOBS">
                      {/* TAB 1 -> ACTIVE */}
                      <BootstrapTable ref="activeTable" condensed hover
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
                          width="150px"
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



                    <Tab eventKey={2} title="COMPLETED ORDERS">
                      {/* TAB 2 -> COMPLETE TABLE */}
                      <BootstrapTable ref="completeTable" hover condensed
                        options={ completeOptions }
                        bordered={ false }
                        data={ this.state.completeOrders }
                        selectRow={ selectCompleteRow }
                        expandableRow={ this.isExpandableRow }
                        expandComponent={ this.expandCompleteComponent }
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
                          width="150px"
                          dataAlign='center'
                          tdStyle={ { whiteSpace: 'normal' } }
                        >ADDRESS</TableHeaderColumn>
                        <TableHeaderColumn
                          width='80px'
                          dataAlign='center'
                          dataFormat={this.buttonCompleteFormatter}
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

export default withRouter(EmployeeProfile);

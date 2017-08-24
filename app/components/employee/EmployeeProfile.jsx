import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron} from 'react-bootstrap';

class EmployeeProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentWillMount() {
    axios.get('/api/authEmployee')
    .then((res) => {
      console.log(res.data[0]);
      // const data = res.data[0];
    })
    .catch((err) => {
      console.log(err);
      browserHistory.push('/login');
    });
  }


  render() {
    return (
      <div className="row">
        <div className="col-sm-12">

          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">
              <h1>Welcome, <small>Employee</small>!</h1>


            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default withRouter(EmployeeProfile);

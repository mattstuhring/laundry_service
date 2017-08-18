import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron} from 'react-bootstrap';

class CustomerProfile extends React.Component {
  constructor(props) {
    super(props)
  }

  // componentWillMount() {
  //   axios.get('/auth')
  //     .then((res) => {
  //       console.log(res.status);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  render() {
    return (
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <Jumbotron>
            <h2>Welcome, <small>Customer</small>!</h2>
          </Jumbotron>
        </div>
      </div>
    )
  }
}

export default withRouter(CustomerProfile);

import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron} from 'react-bootstrap';

class AdminProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentWillMount() {
    axios.get('/api/authAdmin')
    .then((res) => {
      console.log(res);
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
        <div className="col-sm-6 col-sm-offset-3">
          <Jumbotron>
            <h2>Welcome, <small>ADMIN</small>!</h2>
          </Jumbotron>
        </div>
      </div>
    )
  }
}

export default withRouter(AdminProfile);

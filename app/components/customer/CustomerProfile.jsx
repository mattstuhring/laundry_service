import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import {Jumbotron} from 'react-bootstrap';

class CustomerProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      address: '',
      email: '',
      phoneNumber: ''
    }
  }

  componentWillMount() {
    axios.get('/api/authCustomer')
    .then((res) => {
      console.log(res);
      const data = res.data[0];
      this.setState({
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        email: data.email,
        phoneNumber: data.phoneNumber
      })
    })
    .catch((err) => {
      console.log(err);
      browserHistory.push('/login');
    });
  }

  render() {
    const { firstName } = this.state;

    return (
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <Jumbotron>
            <h2>Welcome, <small>Customer: {firstName}</small>!</h2>
          </Jumbotron>
        </div>
      </div>
    )
  }
}

export default withRouter(CustomerProfile);

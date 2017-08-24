import React from 'react';
import axios from 'axios';
import { browserHistory, withRouter } from 'react-router';
import {Button, FormGroup, FormControl, InputGroup, Panel, ControlLabel} from 'react-bootstrap';

class CustomerProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      address: '',
      email: '',
      phoneNumber: '',
      honeypot: ''
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

  handleSubmit(event) {
    event.preventDefault();
  }


  // HANDLE FORM INPUT EVENT CHANGES
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }


  render() {
    const { firstName } = this.state;

    return (
      <div className="row customer-profile">
        <div className="col-sm-4 col-sm-offset-4">

          <div className="row">
            <div className="col-sm-12">
              <div className="page-header text-center">
                <h2>Welcome, <small>{firstName}</small>!</h2>
              </div>
            </div>
          </div>

          <Panel>
            <div className="row">
              <div className="col-sm-12">
                <div className="page-header text-center">
                  <h3><em>Pickup location?</em></h3>
                </div>
              </div>
            </div>

            <div className="row home-btn">
              <div className="col-sm-8 col-sm-offset-2 text-center">
                <Button
                  bsStyle="primary"
                  type="button"
                  bsSize="large"
                  block
                >
                  HOME
                </Button>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 text-center">
                <p>or</p>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <FormGroup controlId="user">
                    <ControlLabel>New Address</ControlLabel>
                      <FormControl
                        type="text"
                        placeholder="Address"
                        name="address"
                        value={this.state.address}
                        onChange={this.handleChange.bind(this)}
                      />
                  </FormGroup>


                  {/* SPAM PROTECTION */}
                  <div className="form-group hidden">
                    <label>Keep this field blank</label>
                    <input
                      type="text"
                      className="form-control"
                      name="honeypot"
                      value={this.state.honeypot} onChange={this.handleChange.bind(this)}
                    />
                  </div>

                  <div className="row send-btn">
                    <div className="col-sm-8 col-sm-offset-2 text-center">
                      <Button
                        bsStyle="primary"
                        type="submit"
                        bsSize="large"
                        block
                      >
                        SEND
                      </Button>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    )
  }
}

export default withRouter(CustomerProfile);

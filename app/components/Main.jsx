import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import axios from 'axios';
import Navigation from 'Navigation';
import { Modal, Button, FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

export class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      alertVisible: false,
      email: '',
      message: '',
      honeypot: ''
    }

    this.setToast = this.setToast.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.messageValidationState = this.messageValidationState.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
  }


  handleSubmit(e) {
    e.preventDefault();
    const { email, message, honeypot } = this.state;

    if (honeypot === '' && email !== '' && message !== '') {
      axios.post('/api/email', { email, message })
        .then((res) => {
          this.setToast('Message has been sent!', {type: 'success'});
          this.setState({ showModal: false, email: '', message: '' });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('ERROR!!!');
      this.setState({ alertVisible: true });
    }
  }


  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }


  close() {
    this.setState({ showModal: false, email: '', message: '' });
  }


  open() {
    this.setState({ showModal: true });
  }


  setToast(message, type) {
    toast(message, type);
  }


  handleAlertDismiss() {
    this.setState({alertVisible: false});
  }


  messageValidationState() {
    const { message } = this.state;

    if (message.length > 0) return 'success';
  }




  // ********************  RENDER  **************************
  render() {
    const alert = () => {
      if (this.state.alertVisible) {
        return <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
          <p>Email address and message are required.</p>
        </Alert>;
      }
    };


    return (
      <div className="container-fluid main-height">
        <div className="row main-height">
          <div className="col-xs-12 col-sm-12 main-height">
            <div className="main">

              {/* React Toast Container */}
              <ToastContainer
                toastClassName="toast"
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                style={{position: 'fixed', zIndex: 3}}
              />

              {/* CONTACT US MODAL */}
              <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                  <Modal.Title>How can we help?</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.handleSubmit}>
                  <Modal.Body>

                    {alert()}

                    <FormGroup
                      controlId="formBasicText"
                    >
                      <ControlLabel>Email</ControlLabel>
                      <FormControl
                        type="email"
                        name="email"
                        value={this.state.email}
                        placeholder="Enter email address"
                        onChange={this.handleChange}
                      />
                      <FormControl.Feedback />
                    </FormGroup>

                    <FormGroup
                      controlId="formBasicText"
                      validationState={this.messageValidationState()}
                    >
                      <ControlLabel>Message</ControlLabel>
                      <FormControl
                        componentClass="textarea"
                        type="text"
                        name="message"
                        value={this.state.message}
                        placeholder="Enter message"
                        onChange={this.handleChange}
                      />
                      <FormControl.Feedback />
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

                  </Modal.Body>
                  <Modal.Footer>
                    <Button bsStyle="primary" type="submit">Send message</Button>
                  </Modal.Footer>
                </form>
              </Modal>


              {/* TOP NAVBAR */}
              <Navigation setToast={this.setToast}/>


              {/* React router child components */}
              <div className="row children-row">
                <div className="col-xs-12 col-sm-10 col-sm-offset-1 children">
                  {React.cloneElement(this.props.children, {
                    setToast: this.setToast
                  })}
                </div>
              </div>


              {/* FOOTER */}
              <footer id="myFooter" className="navbar-fixed-bottom">
                <div className="fluid-container">
                  <div className="footer-copyright text-center">
                    <div className="row">
                      <div className="col-xs-4 col-sm-4 text-center copy-text">
                        <p>&copy; 2017 Laundry Sucks.</p>
                      </div>
                      <div className="col-xs-4 col-sm-4 text-center">
                        <button type="button" className="btn btn-default" onClick={() => {this.open()}}>Contact Us</button>
                      </div>
                      <div className="col-xs-4 col-sm-4 text-center developer-text">
                        <p><em>Web Developer: </em><a href="https://github.com/mattstuhring" target="_blank">Matt Stuhring</a></p>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Main);

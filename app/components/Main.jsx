import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import Navigation from 'Navigation';
import { ToastContainer, toast } from 'react-toastify';

export class Main extends React.Component {
  constructor(props) {
    super(props);

    this.setToast = this.setToast.bind(this);
  }

  setToast(message, type) {
    toast(message, type);
  }

  render() {
    return (
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

        {/* TOP NAVBAR */}
        <Navigation setToast={this.setToast}/>

        <div className="container-fluid children">
            {/* React router child components */}

              {React.cloneElement(this.props.children, {
                setToast: this.setToast
              })}

        </div>

        {/* <nav className="navbar navbar-default navbar-fixed-bottom">
          &copy; Copyright 2017 | Laundry Service | Created by: Matt Stuhring
        </nav> */}
      </div>
    );
  }
}

export default withRouter(Main);

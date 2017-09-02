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
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          style={{position: 'fixed', zIndex: 2}}
        />

        {/* TOP NAVBAR */}
        <Navigation setToast={this.setToast}/>

        <div className="container">
          <div className="panel panel-default main-overlay">
            <div className="panel-body">

              <div className="row">
                {/* HEADER */}
                <div className="col-sm-12">
                  <div className="page-header main-header text-center">
                    <h1>Laundry Service</h1>
                  </div>
                </div>
              </div>


              <div className="row">
                {/* React router child components */}
                <div className="col-sm-12">

                  {React.cloneElement(this.props.children, {
                    setToast: this.setToast
                  })}

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default withRouter(Main);

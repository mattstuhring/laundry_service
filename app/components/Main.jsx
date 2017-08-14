import React from 'react';
import Navigation from 'Navigation';


export default class Main extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="main">
        {/* TOP NAVBAR */}
        <Navigation/>

        <div className="container">
          <div className="panel panel-default main-overlay">
            <div className="panel-body">

              <div className="row">
                {/* HEADER */}
                <div className="col-sm-12">
                  <div className="page-header text-center">
                    <h1>React Project Template</h1>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* React router child components */}
                <div className="col-sm-9">
                  <div className="row">
                    <div className="col-sm-12">
                      {this.props.children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

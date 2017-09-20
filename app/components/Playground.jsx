import React from 'react';
import Checkout from 'Checkout';
import {FormGroup, ControlLabel, InputGroup, FormControl} from 'react-bootstrap';
// import Map from 'Map';
import DayPickerInput from "react-day-picker/DayPickerInput";
import moment from 'moment';

import Countdown from 'react-countdown-now';


export default class Playground extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }



  render() {
    const Completionist = () => <span>You are good to go!</span>;

    return (
      <div className="row">
        <div className="col-sm-12">
          <h1>Playground</h1>
          {/* <Map
            containerElement={<div style={{ height: 400 + "px" }} />}
            mapElement={<div style={{ height: 100 + "%" }} />}
          /> */}

          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">

              <Countdown date={Date.now() + 5000}>
                <Completionist />
              </Countdown>

            </div>
          </div>

        </div>
      </div>
    );
  }
}

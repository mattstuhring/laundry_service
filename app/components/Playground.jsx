import React from 'react';
import Checkout from 'Checkout';
import {FormGroup, ControlLabel, InputGroup, FormControl} from 'react-bootstrap';
// import Map from 'Map';
import DayPickerInput from "react-day-picker/DayPickerInput";
import moment from 'moment';


export default class Playground extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDay: undefined
    };

  }

  handleDayChange = selectedDay => {
    this.setState({ selectedDay });
  };


  render() {
    const value = this.state.selectedDay
      ? this.state.selectedDay.format('MM/DD/YYYY')
      : '';

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

              <p>
                <label >Please enter a day:</label>
              </p>
              <DayPickerInput
                name="birthday"
                placeholder="Please select date"
                format="MM/DD/YYYY"
                value={value}
                onDayChange={this.handleDayChange}
              />

            </div>
          </div>

        </div>
      </div>
    );
  }
}

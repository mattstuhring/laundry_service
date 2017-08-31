import React from 'react';
import Checkout from 'Checkout';
import Map from 'Map';


export default class Playground extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <h1>Playground</h1>

          <Checkout
            name={'The Road to learn React'}
            description={'Only the Book'}
            amount={5000}
          />

          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">
              Hello
              <Map
                containerElement={<div style={{ height: 400 + "px" }} />}
                mapElement={<div style={{ height: 100 + "%" }} />}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

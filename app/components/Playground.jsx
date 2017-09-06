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

//
// {/* <Tabs activeKey={this.state.formKey} onSelect={this.handleSelectKey} id="controlled-tab-example">
//
//   {/* SERVICES */}
//   <Tab eventKey={1} title="Services">
//     <FormGroup controlId="user">
//       <ControlLabel bsClass="click-input">Services:</ControlLabel>
//       <Checkbox
//         inline
//         value={'clean'}
//         onChange={this.handleBoxChange.bind(this)}
//       >
//         Wash/Dry
//       </Checkbox>
//       {' '}
//       <Checkbox
//         inline
//         value={'fold'}
//         onChange={this.handleBoxChange.bind(this)}
//       >
//         Fold
//       </Checkbox>
//     </FormGroup>
//
//     {/* NUMBER OF LOADS */}
//     <FormGroup controlId="user">
//       <ControlLabel bsClass="click-input">Number of Loads:</ControlLabel>
//       <Radio
//         name="radioGroup"
//         inline
//         name="orderLoads"
//         value={1}
//         onChange={this.handleChange.bind(this)}
//       >
//         1
//       </Radio>
//       {' '}
//       <Radio
//         name="radioGroup"
//         inline
//         name="orderLoads"
//         value={2}
//         onChange={this.handleChange.bind(this)}
//       >
//         2
//       </Radio>
//       {' '}
//       <Radio
//         name="radioGroup"
//         inline
//         name="orderLoads"
//         value={3}
//         onChange={this.handleChange.bind(this)}
//       >
//         3
//       </Radio>
//     </FormGroup>
//
//     {/* SPECIAL INSTRUCTIONS */}
//     <FormGroup controlId="user">
//       <ControlLabel>Instructions:</ControlLabel>
//         <FormControl
//           componentClass="textarea"
//           type="text"
//           placeholder="Any special instructions?"
//           name="orderInstructions"
//           value={this.state.orderInstructions}
//           onChange={this.handleChange.bind(this)}
//         />
//     </FormGroup>
//
//     <div className="row">
//       <div className="col-sm-6">
//         <Button
//           bsStyle="primary"
//           type="button"
//           onClick={() => this.handleSelectKey(2)}
//           block
//         >
//           Next
//         </Button>
//       </div>
//       {/* <div className="col-sm-6">
//         <Button
//           bsStyle="primary"
//           type="button"
//           onClick={() => browserHistory.push('/')}
//           block
//         >
//           Cancel
//         </Button>
//       </div> */}
//     </div>
//   </Tab>
//
//
//   {/* PERSONAL INFO */}
//   <Tab eventKey={2} title="Personal">
//     {/* ADDRESS */}
//     <FormGroup controlId="user">
//       <ControlLabel>Address:</ControlLabel>
//       <FormControl
//         type="text"
//         placeholder="Address"
//         name="orderAddress"
//         value={this.state.orderAddress}
//         onChange={this.handleChange.bind(this)}
//       />
//     </FormGroup>
//
//     {/* CONTACT */}
//     <FormGroup controlId="user">
//       <ControlLabel>Contact:</ControlLabel>
//         <FormControl
//           type="text"
//           placeholder="How would you like to be contacted?"
//           name="orderContact"
//           value={this.state.orderContact}
//           onChange={this.handleChange.bind(this)}
//         />
//     </FormGroup>
//
//     {/* SPAM PROTECTION */}
//     <div className="form-group hidden">
//       <label>Keep this field blank</label>
//       <input
//         type="text"
//         className="form-control"
//         name="honeypot"
//         value={this.state.honeypot} onChange={this.handleChange.bind(this)}
//       />
//     </div>
//
//
//     <div className="row">
//       <div className="col-sm-6">
//         <Button
//           bsStyle="primary"
//           type="button"
//           onClick={() => this.handleSelectKey(1)}
//           block
//         >
//           Back
//         </Button>
//       </div>
//       <div className="col-sm-6">
//         <Button
//           bsStyle="primary"
//           type="button"
//           onClick={() => this.handleSelectKey(3)}
//           block
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   </Tab>
//
//
//   {/* STRIPE PAYMENT BTN */}
//   <Tab eventKey={3} title="Payment">
//     {/* OREDER BTN */}
//     <div className="row send-btn">
//       <div className="col-sm-8 col-sm-offset-2 text-right">
//
//         <Checkout
//           name={'The Road to learn React'}
//           description={'Only the Book'}
//           amount={5000}
//         />
//
//       </div>
//
//       <div className="row">
//         <div className="col-sm-6">
//           <Button
//             bsStyle="primary"
//             type="button"
//             onClick={() => this.handleSelectKey(2)}
//             block
//           >
//             Back
//           </Button>
//         </div>
//       </div>
//     </div>
//   </Tab>
// </Tabs> */}

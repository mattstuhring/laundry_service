import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import { Button, Panel } from 'react-bootstrap';

class Failure extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
        Failure
      </div>
    );
  }
}

export default withRouter(Failure);

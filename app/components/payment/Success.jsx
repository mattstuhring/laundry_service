import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import { Button, Panel } from 'react-bootstrap';

class Success extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
        Success
      </div>
    );
  }
}

export default withRouter(Success);

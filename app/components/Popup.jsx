import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class Popup extends React.Component {
  render() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{this.props.message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={() => this.props.action()}>
            Yes
          </Button>
          <Button onClick={this.props.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

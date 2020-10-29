import React from 'react';
import {Button} from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal';


class SubscribeModal extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            didSubscribe: false,
            email: ""
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleEmailInput = this.handleEmailInput.bind(this);
        this.handleSubscribe = this.handleSubscribe.bind(this);
    }
    alertEmail() {
      alert("Notifications will be sent to "+this.state.email+" if a breach occurs.")
    }
    handleEmailInput(event) {
      this.setState({email: event.target.value});
      event.preventDefault();
    }
    handleSubscribe(event) {
      this.setState(
        {
          didSubscribe: true
        }
      )
    }
    handleShow() {
        this.setState(
            {
                show: true
            }
        )
        
    }
    handleClose() {
        this.setState(
            {
                show: false,
                didSubscribe: false,
                email: ""
            }
        )
    }
    render() {
      return (
        <>
{/* 
          <Button variant="dark" active={false} onClick={this.handleShow}>
            Subscribe
          </Button>
*/}
          <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Email Notifications</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Get notified when your email is involved in a data breach. <p></p>
            {this.state.didSubscribe ? 
            <p>You will now be notified of future breaches!</p> : 
            null}
          </Modal.Body>
          
          <Modal.Footer>
          {this.state.didSubscribe ?
          <Button onClick={this.handleClose} variant="dark">
          Close
          </Button>
          :
          <form className="form-inline form-group" onSubmit={this.handleSubscribe}>
          <input id="emailSignup" className="form-control" placeholder="Email" value={this.state.email} onChange={this.handleEmailInput} aria-label="subscribeSignup"/>
            <Button variant="dark" type="submit">
              Subscribe
            </Button>
          </form> 
          }
          </Modal.Footer>
        </Modal>
        </>
      );
      }
    }
  

export default SubscribeModal;
import React from 'react';
import Alert from 'react-bootstrap/Alert';
import SubscribeModal from '../Components/Sub.js';
import '../App.css'

class GoodNews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }

    render() {
      return (
        <div className="row justify-content-center">
            <div className="col justify-content-center">
            <div className="row justify-content-center" style={{color:"white"}}>
            <Alert style={{backgroundColor: "#b4c7e7", color:"white"}}>
                <h2>Good news! Your information has <span style={{color:"#222A35"}}>not been compromised!</span></h2>
                <div className="row justify-content-center">
                <h2>BROWSE SAFELY!</h2>
            </div>
            </Alert>
            </div>
            
            <div className="row justify-content-center" style={{paddingTop:"30px"}}>
            <Alert style={{backgroundColor:'#7C7C7C', color:'white', cursor:'pointer'}} onClick={this.subscribe}>
                    Sign up to get notified if your information is involved in a future data breach.
            </Alert>
            <SubscribeModal ref={this.Modal}/>
            </div>
            </div>
        </div>
      )
    }
}

export default GoodNews;






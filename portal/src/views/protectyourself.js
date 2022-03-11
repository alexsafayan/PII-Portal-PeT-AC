import React from 'react';
import '../App.css'
import Button from 'react-bootstrap/Button'


export const ProtectYourself = props => {
    return (
      <div className="row justify-content-center">
      <div className="col-lg-11" style={{color:'white'}}>

        <div className = "row justify-content-center">
          <h1>PROTECT YOURSELF</h1>
        </div>

        <div className="col-lg-6">
          <div className = "row justify-content-center" style={{paddingBottom:"60px", paddingTop: "40px"}}>
            <h2>4 Steps to Better Online Security: </h2>
          </div>
        </div>
        <div className="row">
        <div className="col-lg-3">
            <div className="row justify-content-center">
              <img src="useAccountAuthentication.png" height="100px" alt="account authentication"></img>
            </div>
            <div className="row justify-content-center">
              <h3>Use Account Authentication</h3>
            </div>
            <div className="row justify-content-center">
              <Button className="learn-more-button" size='lg'>Learn More</Button>
            </div>
        </div>
        <div className="col-lg-3">
            <div className="row justify-content-center">
              <img src="useStrongPasswords.png" height="100px" alt="strong passwords"></img>
            </div>
            <div className="row justify-content-center">
              <h3>Use Strong Passwords</h3>
            </div>
            <div className="row justify-content-center">
              <Button className="learn-more-button" size='lg'>Learn More</Button>
            </div>
        </div>
        <div className="col-lg-3">
            <div className="row justify-content-center">
              <img src="keepSoftwareUpdated.png" height="100px" alt="keep software updated"></img>
            </div>
            <div className="row justify-content-center">
              <h3>Keep Software Updated</h3>
            </div>
            <div className="row justify-content-center">
              <Button className="learn-more-button" size='lg'>Learn More</Button>
            </div>
        </div>
        <div className="col-lg-3">
            <div className="row justify-content-center">
              <img src="stayEducatedOnPhishing.png" height="100px" alt="stay educated on phishing"></img>
            </div>
            <div className="row justify-content-center">
              <h3>Stay Educated on Phishing</h3>
            </div>
            <div className="row justify-content-center">
              <Button className="learn-more-button" size='lg'>Learn More</Button>
            </div>
        </div>
        </div>
      <hr></hr>
        {/* resources row */}
          <div className="col-lg-6">
            <div className = "row justify-content-center" style={{paddingBottom:"60px", paddingTop: "40px"}}>
              <h2>Resources: </h2>
            </div>
          </div>
          <div className="row justify-content-center">
            
            <div className="col-lg-3">
                  <img src="cyberSecurityEducation.png" height="100px" alt="cse"></img>
            </div>
            <div className="col-lg-3">
                  <img src="insa.png" height="100px" alt="insa"></img>
            </div>
            <div className="col-lg-3">
                  <img src="cae.png" height="100px" alt="cae"></img>
            </div>
          </div>
        

          <div>&nbsp;</div>
      </div>
      
      </div>
    );
  };
  
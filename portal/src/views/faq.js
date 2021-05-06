import React from 'react';
import '../App.css'


export const Faq = props => {
    return (
      <div style={{color:'white'}}>
        <div className = "row d-flex justify-content-center">
          <h1>Frequently Asked Questions</h1>
        </div>

        <div className = "row d-flex justify-content-center"> 
        <div className="col-lg-5">
        <div className = "row d-flex justify-content-left"> 
          <h2>What is a breach?</h2>
        </div>
        <div style={{fontSize:'large'}} className = "row d-flex justify-content-left"> 
            A breach is a security incident where information is accessed by outside parties without authorization. 
              A breach can affect businesses, organizations, and institutions, as well as individuals. Breaches can 
              occur as a result of targeted attacks carried out by exploiting:
        </div>
        <div className = "row d-flex justify-content-left"> 
          <ui>
            <li>Vulnerabilities in software</li>
            <li>Weak passwords</li>
            <li>Social relationships</li>
            &nbsp;
          </ui>
        </div>
        </div>
        <div className="col-lg-2"></div>
        </div>

        <div className = "row d-flex justify-content-center"> 
        <div className="col-lg-5">
        <div className = "row d-flex justify-content-left"> 
          <h2>How is data stored?</h2>
        </div>
        <div style={{fontSize:'large'}} className = "row d-flex justify-content-left"> 
          <p>As a privacy portal, our goal is to raise our users' awareness about their exposed information. 
            As such, the data available on the portal is stored securely to ensure that we do not inadvertently put our users at risk</p>
        </div>
        </div>
        <div className="col-lg-2"></div>
        </div>

        <div className = "row d-flex justify-content-center"> 
        <div className="col-lg-5">
        <div className = "row d-flex justify-content-left"> 
          <h2>Is searching my information safe?</h2>
        </div>
        <div style={{fontSize:'large'}} className = "row d-flex justify-content-left"> 
          <p>Yes, searching for your information is safe. We do not store any user information other than data that has been leaked on the Dark Web.</p>
        </div>
        </div>
        <div className="col-lg-2"></div>
        </div>


        <div className = "row d-flex justify-content-center"> 
        <div className="col-lg-5">
        <div className = "row d-flex justify-content-left"> 
          <h2>What is a privacy risk score?</h2>
        </div>
        <div style={{fontSize:'large'}} className = "row d-flex justify-content-left"> 
          <p>A privacy risk score is a summary of your information that we could find online. The higher it is, the more information an adversary can gather about you online.</p>
        </div>
        </div>
        <div className="col-lg-2"></div>
        </div>

      </div>
    );
  };
  
//export default About;
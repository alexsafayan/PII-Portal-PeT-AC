import React from 'react';
import '../App.css'


export const About = props => {
    return (
      <div style={{color:'white'}}>
        <div className = "row d-flex justify-content-center">
          <h1>About AZSecure Privacy Portal</h1>
        </div>

        <div className = "row d-flex justify-content-center"> 
        <div className="col-lg-4">
        <div className = "row d-flex justify-content-left"> 
          <h3>What is the AZSecure Privacy Portal?</h3>
        </div>
        <div className = "row d-flex justify-content-left"> 
            <p>The AZSecure Privacy Portal is a tool for discovering exposed private information such as email addresses, phone numbers, and passwords. </p>
        </div>
        </div>
        <div className="col-lg-2"></div>
        </div>

        <div className = "row d-flex justify-content-center"> 
        <div className="col-lg-4">
        <div className = "row d-flex justify-content-left"> 
          <h3>How it works:</h3>
        </div>
        <div className = "row d-flex justify-content-left"> 
          <ui>
          <li><b>Data Collection:</b> Over 8 billion records collected from the dark web containing private information from large scale data breaches.</li>
            <li><b>Real Time Searching</b> through 6 mainstream people search engine.</li>
            <li><b>AI Identity Matching:</b> State of the art machine learning is used for matching identities across the different sources.</li>
            &nbsp;
          </ui>
        </div>
        </div>
        <div className="col-lg-2"></div>
        </div>

        <div className = "row d-flex justify-content-center"> 
        <div className="col-lg-4">
        <div className = "row d-flex justify-content-left"> 
          <h3>How it can help you:</h3>
        </div>
        <div className = "row d-flex justify-content-left"> 
          <ui>
            <li><b>Discover:</b> Leaked information about you or your loved ones.</li>
            <li><b>Inform:</b> Subscribe to future breaches to get live privacy monitoring services.</li>
            <li><b>Act:</b> Gain insight into improving your privacy footprint.</li>
            &nbsp;
          </ui>
        </div>
        </div>
        <div className="col-lg-2"></div>
        </div>
      </div>
    );
  };
  
//export default About;
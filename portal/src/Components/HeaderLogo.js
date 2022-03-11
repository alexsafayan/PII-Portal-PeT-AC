import React from 'react';
import '../App.css'

class HeaderLogo extends React.Component {

    render() {
      return (
        <div style={{padding:'0.5rem'}}className="jumbotron bg-white text-center">
          <div className="row justify-content-center">
            <img style={{height:"300px"}} src='logo_final.png' alt="AZSecure Lock"></img>
            {/* <h1 style={{fontSize:"80px", color: 'black'}}>AZSecure Privacy Portal</h1> */}
          </div>
          {/* <p style={{fontSize:"x-large", color: 'black'}}>Search. Know. Act.</p> */}
        </div>
      )
    }
}

export default HeaderLogo;
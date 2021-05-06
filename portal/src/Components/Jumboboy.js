import React from 'react';
import '../App.css'

class Jumboboy extends React.Component {

    render() {
      return (
        <div className="jumbotron bg-white text-center">
          <div className="row justify-content-center">
            <img style={{height:"100px"}} src='lock.svg' alt="AZSecure Lock"></img>
            <h1 style={{fontSize:"80px", color: 'black'}}>AZSecure Privacy Portal</h1>
          </div>
          <p style={{fontSize:"x-large", color: 'black'}}>Search. Know. Act.</p>
        </div>
      )
    }
}

export default Jumboboy;
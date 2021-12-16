import React from 'react';
import '../App.css'
import Boxplot from '../Components/Boxplot.js'
import Button from 'react-bootstrap/Button'
import GaugeChart from 'react-gauge-chart';


class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  
  render() {
    return (
      
        <div className="col-lg-4" style={{color: 'black', backgroundColor:"white"}}>
            <div className="row justify-content-center" style={{color:'white'}}>
            <h1>Coming soon.</h1>
            </div>
            <Boxplot bottomColor="#00FF00" topColor="#FF0000" score={10}></Boxplot>
        </div>

    );
  };
}




export default Test;
  
      
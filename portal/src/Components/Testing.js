import React from 'react';
import DisplayResults from './DisplayResults.js'
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';
import EmailDataService from "../services/email.service";
import axios from "axios";
import Alert from 'react-bootstrap/Alert'
import GaugeChart from 'react-gauge-chart'


class Testing extends React.Component {

    

    

    render() {
        return [
            <GaugeChart id="gauge-chart2" 
            nrOfLevels={3} 
            percent={0.67}
            textColor={"#000000"} 
            arcsLength={[0.3, 0.5, 0.2]}
          />
        ]
    }
}

export default Testing;
import React from 'react';
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
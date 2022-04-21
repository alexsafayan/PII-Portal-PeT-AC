import React from 'react';
import '../App.css'
import Chart from 'react-apexcharts'

class Boxplot extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [
          {
            name: 'average privacy score',
            type: 'boxPlot',
            data: [
              {
                x: 0,
                y: [0.4, 1.1, 1.5, 2.3, 4.0]
              }
            ]
          },
          
        ],
        options: {
          chart: {
            type: 'boxPlot',
            height: 200
          },
          title: {
            text: 'Basic BoxPlot Chart',
            align: 'left'
          },
          plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '50%'
              },
            boxPlot: {
              colors: {
                upper: this.props.topColor,
                lower: this.props.bottomColor
              }
            }
          }
        },
      
      
      };
    }

  

    render() {
      return (
        <div id="chart">
        <Chart options={this.state.options} series={this.state.series} type="boxPlot" height={200} />
        </div>
);
}
}

export default Boxplot;
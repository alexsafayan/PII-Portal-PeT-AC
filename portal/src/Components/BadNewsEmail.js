import React from 'react';
import Alert from 'react-bootstrap/Alert';
import '../App.css'

class BadNews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }

    render() {
      return (
        <div className="row justify-content-center">
            <div className="col-lg-6">
            <div className="row justify-content-center" style={{color:"white"}}>
            <Alert style={{backgroundColor:'#ff8d88', color:'white'}}>
                <h2>Your email has been<span style={{color:"#cc0000"}}> compromised!</span></h2>
                <h4>
                    {this.props.breaches.map((value, index) => {
                        return <p>{value}</p>
                    })}
                </h4>
                <div className="row justify-content-center text-center">
                    <div className="col-lg-8">
                        <Alert style={{backgroundColor:'#7C7C7C', color:'white'}}>
                            What was compromised? password
                        </Alert>
                    </div>
                </div>
            </Alert>
            </div>
            </div>
        </div>
      )
    }
}

export default BadNews;






import React from 'react';
import Alert from 'react-bootstrap/Alert';
import SubscribeModal from '../Components/Sub.js';
import '../App.css'

class DatabaseResponse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dbResponse: this.props.dbResponse,
            es: this.props.es,
        };
      }

    render() {
      return (
        <div>
            <h1 className="text-center">We found {this.state.dbResponse.length} result{this.state.es} in our breached records:</h1>
            <div className="row">
            {this.props.dbResponse.map((value, index) => {
                return <div className="col-4" style={{paddingBottom: "10px"}}>
                    <div className="card" style={{paddingBottom: "10px", backgroundColor:"#609cd4", cursor: 'pointer', height:'100%', width: '100%'}} onClick={(e) => this.props.chooseDbResponse(index, e)}>
                        <div className="row justify-content-center">
                            <img src='cardProfileImage.png' style={{height:'100px', width: '100px'}} alt={"card profile#" + index }></img>
                        </div>
                        <div className="card-body" style={{paddingBottom: "10px"}}>
                            <h5 className="card-title">{value.name}</h5>
                            <p className="card-text">Phone number: {value.phoneNumber}</p>
                            <p className="card-text">Birthyear: {value.birthyear}</p>
                            <p className="card-text">Source: {value.platform}</p>
                        </div>
                    </div>
                </div>
            })}
            </div>
            <div className="row justify-content-center">
            <div className="col-4">
                <Alert style={{backgroundColor:'#7C7C7C', color:'white', cursor:'pointer', textAlign: 'center'}} onClick={(e) => this.props.displayGoodNews(e)}>
                    None of these profiles match.
                </Alert>
            </div>
            </div>
        </div>
      )
    }
}

export default DatabaseResponse;
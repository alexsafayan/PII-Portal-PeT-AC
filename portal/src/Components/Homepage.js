import React from 'react';
import DisplayResults from './DisplayResults.js'
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';
import EmailDataService from "../services/email.service";
import axios from "axios";
import Alert from 'react-bootstrap/Alert'

const initialResultsState = {
    email: false,
    password: false,
    zip: false,
    phoneNumber: false,
    ssn: false,
    address: false,
    relatives: false,
    databreach_sources: [],
    surfaceweb_sources: []
};


const AdditionalCriteria = props => {
    return (
        <div className="row d-flex justify-content-center">
        <div className="form-group col-lg-2">
            <input style={{marginBottom: '10px'}} id="emailSearch" className="form-control" type="search" placeholder="Enter email" aria-label="Search" value={props.emailValue} onChange={props.handleEmailChange}/>
            <input style={{marginBottom: '10px'}} id="nameSearch" className="form-control" type="search" placeholder="Enter full name" aria-label="Search" value={props.nameValue} onChange={props.handleNameChange}/>
            <input style={{marginBottom: '10px'}} id="phoneSearc" className="form-control" type="search" placeholder="Enter phone number" aria-label="Search" value={props.phoneValue} onChange={props.handlePhoneChange}/>
            <input style={{marginBottom: '10px'}} id="zipSearch" className="form-control" type="search" placeholder="Enter zip code" aria-label="Search" value={props.zipValue} onChange={props.handleZipChange}/>
            <button className="btn btn-outline-dark btn-block" onClick={props.onClickSubmit}>Search</button>
        </div>
        </div>
    );
}

const DefaultCriteria = props => {
    return (
        <div className="container d-flex justify-content-center">
            <form className="form-inline form-group row" onSubmit={props.handleSubmit}>
                <input id="emailsearch" className="form-control" type="search" placeholder="Enter email address" aria-label="Search" value={props.emailValue} onChange={props.handleChange} />
                <button className="btn btn-outline-dark" type="submit">Search</button>
            </form>
        </div>
    );
}


class Homepage extends React.Component {

    

    constructor(props) {
        super(props);
        this.state = {
          showResults: false,
          results: "",
          emailValue: "",
          phoneValue: "",
          nameValue: "",
          zipValue: "",
          errorMessage: "",
          showAdditionalCriteria: false
        };
        this.callDisplay = this.callDisplay.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleZipChange = this.handleZipChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleShowAdditionalCriteria = this.handleShowAdditionalCriteria.bind(this);
        this.queryMongoEmail = this.queryMongoEmail.bind(this);
        this.queryMongoName = this.queryMongoName.bind(this);
        this.DisplayResults = React.createRef();

        var resultJson = {
            //score: score,
            email: false,
            address: false,
            password: false,
            phoneNumber: false,
            zip: false,
            ssn: false,
            birthday: false,
            hometown: false,
            currenttown: false,
            jobdetails: false,
            relationshipstatus: false,
            interests: false,
            political: false,
            religious: false,
            databreach_sources: [],
            surfaceweb_sources: ['checkmate', 'beenverified', 'spokeo'],
        } 
      }
    
    handleSubmit(event) {
        //query for email
        console.log("in handle submit")
        if(this.state.emailValue.length > 0){
            console.log("email length greater than 0")
            this.queryMongoEmail();
            // .then(response => {
            //     //send the returned json to handle submit
    
            //     alert("in this biznatch")
            //     console.log("second response"+response);
            // }).catch(e => {
            //     console.log(e);
            // });
            //this.callDisplay();
        }
        //query for name and zip/phone
        else if(this.state.nameValue.length > 0 && (this.state.zipValue.length > 0 || this.state.phoneValue.length > 0)){
            console.log("else name and (other) length greater than 0")
            this.queryMongoName();
        }
        event.preventDefault();
    }

    callDisplay(updated_state) {
        //event.preventDefault();
        this.DisplayResults.current.setState(initialResultsState)
        //query data base and surface web
        //display returned results
        var score = 0;
        /*  
            phonenumber: .6,
            email: .1833,
            address: .85,
            birthday: .1166,
            hometown: .15,
            currenttown: .1166,
            jobdetails: .2,
            relationshipstatus: .4166,
            interests: .3,
            political: .6833,
            religious: .5666

        */
        score+= (.6+.1833+.85+.1166)
        // console.log("score: " + score)
        // console.log(updated_state.email)
        // console.log(updated_state.address)
        // console.log(updated_state.password)
        // console.log(updated_state.phoneNumber)
        // console.log(updated_state.zip)
        // console.log(updated_state.ssn)
        // console.log(updated_state.birthday)
        // console.log(updated_state.hometown)
        // console.log(updated_state.currenttown)
        // console.log(updated_state.jobdetails)
        // console.log(updated_state.relationshipstatus)
        // console.log(updated_state.interests)
        // console.log(updated_state.political)
        // console.log(updated_state.religious)
        // console.log("and finally")
        // console.log(false)
        this.DisplayResults.current.setState({
            show: true,
            score: score,
            email: updated_state.email,
            address: updated_state.address,
            password: updated_state.password,
            phoneNumber: updated_state.phoneNumber,
            zip: updated_state.zip,
            ssn: updated_state.ssn,
            birthday: updated_state.birthday,
            hometown: updated_state.hometown,
            currenttown: updated_state.currenttown,
            jobdetails: updated_state.jobdetails,
            relationshipstatus: updated_state.relationshipstatus,
            interests: updated_state.interests,
            political: updated_state.political,
            religious: updated_state.religious,
            databreach_sources: [],
            surfaceweb_sources: ['checkmate', 'beenverified', 'spokeo']

        })
        
    }

    handleEmailChange(event) {
        this.setState({emailValue: event.target.value});
        event.preventDefault();
    }

    handleNameChange(event) {
        this.setState({nameValue: event.target.value});
        event.preventDefault();
    }

    handleZipChange(event) {
        this.setState({zipValue: event.target.value});
        event.preventDefault();
    }

    handlePhoneChange(event) {
        this.setState({phoneValue: event.target.value});
        event.preventDefault();
    }

    handleShowAdditionalCriteria(event) {
        this.setState({showAdditionalCriteria: !this.state.showAdditionalCriteria})
        event.preventDefault();
    }

    queryMongoEmail(event) {
        EmailDataService.get(this.state.emailValue)
        .then(response => {
            //send the returned json to handle submit

            
            console.log(response.data);
            
            this.callDisplay();
            return true;
            //alert("we have your email in database under the name: "+response.data.name)
        }).catch(e => {
            console.log(e);
            return false
            //alert("we do not have your email stored in the database")
        });

        //event.preventDefault();
    }

    queryMongoName(event) {
        var other = this.state.phoneValue;
        if (this.state.zipValue.length > 0) {
            other = this.state.zipValue;
        }
        EmailDataService.getByName(this.state.nameValue, other)
        .then(response => {
            //send the returned json to handle submit
            console.log(response.data);
            // response email:
            //console.log(response.data.email);


            this.callDisplay(response.data);
            return true;
            //alert("we have your email in database under the name: "+response.data.name)
        }).catch(e => {
            console.log(e);
            return false
            //alert("we do not have your email stored in the database")
        });

        //event.preventDefault();
    }

    

    render() {
        return [
                
                <div>
                    {this.state.showAdditionalCriteria ? 
                        <AdditionalCriteria nameValue={this.state.nameValue} zipValue={this.state.zipValue} phoneValue={this.state.phoneValue} emailValue={this.state.emailValue}
                                            handleNameChange={this.handleNameChange} handleZipChange={this.handleZipChange} handlePhoneChange={this.handlePhoneChange} 
                                            handleEmailChange={this.handleEmailChange} onClickSubmit={this.handleSubmit}
                        /> 
                        : 
                        <DefaultCriteria emailValue={this.state.emailValue} handleChange={this.handleEmailChange} handleSubmit={this.handleSubmit}/>
                    }
                </div>,
                <div>
                    {this.state.showAdditionalCriteria ? 
                        null
                        : 
                        <div className="container d-flex justify-content-center">
                        <button className="btn btn-outline-dark" onClick={this.handleShowAdditionalCriteria}>Search by additional criteria</button></div>
                    }
                </div>,
                <div className="container d-flex justify-content-center">
                <Alert variant="danger">
                <p>
                  {this.state.errorMessage}
                </p>
              </Alert></div>,
                <div className="container d-flex justify-content-center">
                    <DisplayResults ref={this.DisplayResults}/>
                </div>

        ]
    }
}

export default Homepage;
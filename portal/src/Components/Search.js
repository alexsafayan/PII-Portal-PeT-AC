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
            <input style={{marginBottom: '10px'}} id="nameSearch" className="form-control" type="search" placeholder="Enter full name" aria-label="Search" value={props.nameValue} onChange={props.handleNameChange}/>
            <input style={{marginBottom: '10px'}} id="phoneSearc" className="form-control" type="search" placeholder="Enter phone number" aria-label="Search" value={props.phoneValue} onChange={props.handlePhoneChange}/>
            <input style={{marginBottom: '10px'}} id="zipSearch" className="form-control" type="search" placeholder="Enter zip code" aria-label="Search" value={props.zipValue} onChange={props.handleZipChange}/>
            <button className="btn btn-outline-dark btn-block" onClick={props.onClickSubmit}>Search</button>
        </div>
        </div>
    );
}



class Search extends React.Component {

    

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
          showAdditionalCriteria: false,
          line1: "",
          line2: "",
          line3: "",
          showplot: false,
          plot: "",
          score: 0
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
        this.queryMongoName2 = this.queryMongoName2.bind(this);
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

        //reset state and results
        this.setState({
            errorMessage: "",
            line1: "",
            line2: "",
            line3: "",
            showplot: false,
            showResults: false

        })
        this.DisplayResults.current.setState({
            show: false,
            score: 0
        })

        //query for email
        console.log("in handle submit")
        if(this.state.nameValue == "Addie Jones" && this.state.zipValue == "15221"){
            
            console.log("addie jones bish")
            this.queryMongoName();
            // .then(response => {
            //     //send the returned json to handle submit
    
            //     alert("in this biznatch")
            //     console.log("second response"+response);
            // }).catch(e => {
            //     console.log(e);
            // });
            //this.callDisplay();
        }
        else if(this.state.nameValue == "Nicholas Deluca") {
            console.log("nick deluca bish")
            this.queryMongoName3();
            
        }
        //query for name and zip/phone
        else if(this.state.nameValue.length > 0 && (this.state.zipValue.length > 0 || this.state.phoneValue.length > 0)){
            console.log("name and other (zip or phone) length greater than 0")
            this.queryMongoName3();
            this.queryMongoName2();
            console.log("queried 3 and 2")
        }
        else {
            console.log("invalid entry")
            this.setState({
                errorMessage: "Please enter name and at least one other attribute."
            })
        }
        event.preventDefault();
    }

    callDisplay(updated_state) {
        //event.preventDefault();
        this.DisplayResults.current.setState(initialResultsState)
        //query data base and surface web
        //display returned results
        var score = 0;
        score+= (updated_state.score)
        console.log("score: " + score)
        console.log(updated_state.email)
        console.log(updated_state.address)
        console.log(updated_state.password)
        console.log(updated_state.phoneNumber)
        console.log(updated_state.zip)
        console.log(updated_state.ssn)
        console.log(updated_state.birthday)
        console.log(updated_state.hometown)
        console.log(updated_state.currenttown)
        console.log(updated_state.jobdetails)
        console.log(updated_state.relationshipstatus)
        console.log(updated_state.interests)
        console.log(updated_state.political)
        console.log(updated_state.religious)
        console.log("and finally")
        console.log(false)
        this.setState({score: score, plot: updated_state.plot});
        this.DisplayResults.current.setState({
            
            email: updated_state.email,
            address: updated_state.address,
            password: updated_state.password,
            phoneNumber: updated_state.phoneNumber,
            zip: updated_state.zip,
            ssn: updated_state.ssn,
            birthday: updated_state.birthday,
            hometown: updated_state.hometown,
            currenttown: updated_state.currentTown,
            jobdetails: updated_state.jobdetails,
            relationshipstatus: updated_state.relationshipStatus,
            interests: updated_state.interests,
            political: updated_state.politicalViews,
            religious: updated_state.religiousViews,
            databreach_sources: [],
            surfaceweb_sources: ['checkmate', 'beenverified', 'spokeo'],
            show: true,
            score: score

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
            this.setState({
                showResults: true,
                //email: true,
                line1: "Your name and zip are compromised!",
                line2: "",
                line3: ""
            })
            return true;
            //alert("we have your email in database under the name: "+response.data.name)
        }).catch(e => {
            console.log("in hizzere")
            this.setState({
                line1: "Your name and zip are NOT compromised!",
                line2: "We do not have your name and zip in our database. Please continue browsing safely!",
                line3: ""
            })
            console.log(e);
            return false
            //alert("we do not have your email stored in the database")
        });

        //event.preventDefault();
    }

    queryMongoName2(event) {
        if(this.state.nameValue.length > 0 && this.state.zipValue > 0){
            console.log(this.state.nameValue);
            EmailDataService.getData(this.state.nameValue, this.state.zipValue)
            .then(response => {
                console.log("query2 response:");
                console.log(response.data);
                //alert("we have your name and zip in database")
                this.setState({
                    //email: true,
                    line1: "Your name and zip are compromised!",
                    line2: "We found the following name and zip in our dark net database.",
                    line3: ""
                })
            }).catch(e => {
                console.log("in hizzere2")
                console.log(e);
                //alert("we do not have your name and zip stored in the database")
                
            });

            //event.preventDefault();
        }

    }

    //newest.  searches database for address and name CONTAINING name and zip values
    queryMongoName3(event) {
        var other = this.state.phoneValue;
        if (this.state.zipValue.length > 0) {
            other = this.state.zipValue;
        }
        EmailDataService.getByName(this.state.nameValue, other)
        .then(response => {
            //send the returned json to handle submit
            console.log("query3 response:");
            console.log(response.data);
            // response email:
            //console.log(response.data.email);


            this.callDisplay(response.data);
            this.setState({
                showResults: true,
                //email: true,
                line1: "Your name and zip are compromised!",
                line2: "",
                line3: ""
            })
            return true;
            //alert("we have your email in database under the name: "+response.data.name)
        }).catch(e => {
            console.log("in hizzere3")
            console.log(e);
            this.setState({
                line1: "Your name and zip are NOT compromised!",
                line2: "We do not have your name and zip in our database. Please continue browsing safely!",
                line3: ""
            })
            return false
            //alert("we do not have your email stored in the database")
        });

        //event.preventDefault();
    }

    

    render() {
        return [
                
                <div>
                    <AdditionalCriteria nameValue={this.state.nameValue} zipValue={this.state.zipValue} phoneValue={this.state.phoneValue} emailValue={this.state.emailValue}
                                        handleNameChange={this.handleNameChange} handleZipChange={this.handleZipChange} handlePhoneChange={this.handlePhoneChange} 
                                        handleEmailChange={this.handleEmailChange} onClickSubmit={this.handleSubmit}
                    /> 
                </div>,
                <div>
                        <div className="container d-flex justify-content-center">
                        <a href="/Home"><button className="btn btn-outline-dark">Search by email</button></a></div>
                </div>,
                
                <div className="container d-flex justify-content-center">
                    {this.state.errorMessage.length == 0 ? 
                    null
                    : 
                    <Alert variant="danger">
                    <p>
                    {this.state.errorMessage}
                    </p>
                </Alert>
                }</div>,
                 <div className="container d-flex justify-content-center">
                 <h1>{this.state.line1}</h1>
                    </div>,
                    <div className="container d-flex justify-content-center">
                    <p>{this.state.line2}</p>
                    <p><b>{this.state.line3}</b></p>
                    </div>,
                 <div className="container d-flex justify-content-center">
                 {this.state.showResults ? 
                     <button className="btn btn-primary" onClick= {() => this.setState({showplot:true,showResults:false})}> See how your score compares </button> 
                     : null
                 }</div>,
                <div className="container d-flex justify-content-center">
                {this.state.showplot ? 
                    <iframe id="igraph" scrolling="no" seamless="seamless" srcdoc={this.state.plot} height="525" width="60%"></iframe> 
                    : null
                }</div>,
                <div className="container d-flex justify-content-center">
                    <DisplayResults ref={this.DisplayResults}/>
                </div>

        ]
    }
}

export default Search;
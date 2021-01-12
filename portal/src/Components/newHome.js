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



const DefaultCriteria = props => {
    return (
        <div className="row d-flex justify-content-center">
            <div className="form-group col-lg-2">
                <input style={{marginBottom: '10px'}} id="emailsearch" className="form-control" type="search" placeholder="Enter email address" aria-label="Search" value={props.emailValue} onChange={props.handleChange} />
                <button className="btn btn-outline-dark btn-block" onClick={props.handleSubmit}>Search</button>
            </div>
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
          showAdditionalCriteria: false,
          line1: "",
          line2: "",
          line3: "",
          showplot: false,
          showEntities: false,
          showHighScore: false,
          showMediumScore: false,
          showSearchByName: true,
          plot: "",
          selectedValue: "",
          val1: {
            name: "Chris Paul",
            age: 36,
            address: "3685 La***** St*****",
            state: true,
            email: "lebron@gmail.com",
            password: false,
            phoneNumber: "***-***-**20",
            zip: true,
            ssn: false,
            birthday: true,
            hometown: true,
            currenttown: false,
            jobdetails: true,
            relationshipstatus: false,
            interests: false,
            political: true,
            religious: false,
            platform: "tormarket, checkmate",
            medianscore: 2.4,
            surfaceweb_sources: ['checkmate', 'beenverified', 'spokeo'],
            show: true,
            score: "medium"
          },
          val2: {
            name: "Chris Paul",
            age: 75,
            address: "1234 Ma***** Ro*****",
            state: true,
            email: "lebron@gmail.com",
            password: false,
            phoneNumber: "***-***-**12",
            zip: true,
            ssn: false,
            birthday: true,
            hometown: true,
            currenttown: false,
            jobdetails: true,
            relationshipstatus: false,
            interests: false,
            political: true,
            religious: false,
            platform: "tormarket, beenverified",
            medianscore: 3.8,
            surfaceweb_sources: ['checkmate', 'beenverified', 'spokeo'],
            show: true,
            score: "high"
          },
          score: 0
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleZipChange = this.handleZipChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleShowAdditionalCriteria = this.handleShowAdditionalCriteria.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        //this.chooseEntity = this.chooseEntity.bind(this)
        this.DisplayResults = React.createRef();
      }
    
    handleSubmit(event) {
        this.setState({
            errorMessage: "",
            line1: "",
            line2: "",
            line3: "",
            showplot: false,
            plot: "",
            showResults: false,
            showEntities: false,
            showHighScore: false,
            showMediumScore: false,
            showSearchByName: true,
            score: 0
        })
        this.DisplayResults.current.setState({
            show: false,
            score: 0
        })

        //query for email
        console.log("in handle submit")
        if(this.validateEmail(this.state.emailValue)) {
            console.log("email is valid")
            this.setState({
                showEntities: true,
                showSearchByName: false
            })


        }
        //query for name and zip/phone
        else{
            console.log("email is invalid")
            this.setState({
                errorMessage: "Please enter a valid email address."
            })
        }
        event.preventDefault();
    }

    setSelection(event) {
        console.log(event.target.value);
        this.state.selectedValue = event.target.value;
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

    chooseEntity(event) {
        console.log("selected value: "+this.state.selectedValue)
        if(this.state.selectedValue == "val1") {

            EmailDataService.dummyGet(this.state.selectedValue)
            .then(response => {
                console.log("val1")
                console.log("email response")
                console.log(response);
                console.log("email response data")
                console.log(response.data);
                this.setState(
                    {
                        showEntities: false,
                        showMediumScore: true,
                        plot: response.data.plot,
                        score: response.data.score
                    }
                )
            }).catch(e => {
                console.log("error boi : "+e);
            });

            
        } else if (this.state.selectedValue == "val2") {
            EmailDataService.dummyGet(this.state.selectedValue)
            .then(response => {
                console.log("val2")
                console.log("email response")
                console.log(response);
                console.log("email response data")
                console.log(response.data);
                this.setState(
                    {
                        showEntities: false,
                        showHighScore: true,
                        plot: response.data.plot,
                        score: response.data.score
                    }
                )
            }).catch(e => {
                console.log("error boi : "+e);
            });
            
        }
        //event.preventDefault();
    }

    displayResults(event) {
        if(this.DisplayResults.current.state.show) {
            this.DisplayResults.current.setState({
                show: false,
                score: 0
            })
            this.setState({
                showplot: false,
                showResults: false
            })
        }
        else {
            if(this.state.selectedValue == 'val1') {
                this.DisplayResults.current.setState({
                
                    email: this.state.val1.email,
                    address: this.state.val1.address,
                    password: this.state.val1.password,
                    phoneNumber: this.state.val1.phoneNumber,
                    zip: this.state.val1.zip,
                    ssn: this.state.val1.ssn,
                    birthday: this.state.val1.birthday,
                    hometown: this.state.val1.hometown,
                    currenttown: this.state.val1.currentTown,
                    jobdetails: this.state.val1.jobdetails,
                    relationshipstatus: this.state.val1.relationshipStatus,
                    interests: this.state.val1.interests,
                    political: this.state.val1.politicalViews,
                    religious: this.state.val1.religiousViews,
                    sources: this.state.val1.platform,
                    medianscore: this.state.val1.medianscore,
                    surfaceweb_sources: ['checkmate', 'beenverified', 'spokeo'],
                    show: true,
                    score: 3.6

                })
            }
            else if(this.state.selectedValue == 'val2') {
                this.DisplayResults.current.setState({
                
                    email: this.state.val2.email,
                    address: this.state.val2.address,
                    password: this.state.val2.password,
                    phoneNumber: this.state.val2.phoneNumber,
                    zip: this.state.val2.zip,
                    ssn: this.state.val2.ssn,
                    birthday: this.state.val2.birthday,
                    hometown: this.state.val2.hometown,
                    currenttown: this.state.val2.currentTown,
                    jobdetails: this.state.val2.jobdetails,
                    relationshipstatus: this.state.val2.relationshipStatus,
                    interests: this.state.val2.interests,
                    political: this.state.val2.politicalViews,
                    religious: this.state.val2.religiousViews,
                    sources: this.state.val2.platform,
                    medianscore: this.state.val2.medianscore,
                    surfaceweb_sources: ['checkmate', 'beenverified', 'spokeo'],
                    show: true,
                    score: 5.4

                })
            }
            this.setState(
                {
                    showResults: true
                }
            )
        }
        
    }

    validateEmail(email) {
        console.log("in validate email")
        //const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var re = /\S+@\S+\.\S+/;
        return re.test(String(email).toLowerCase());
    }

    render() {
        return [
                
                <div>
                        <DefaultCriteria emailValue={this.state.emailValue} handleChange={this.handleEmailChange} handleSubmit={this.handleSubmit}/>
                </div>,
                <div>
                    {this.state.showSearchByName ? 
                        <div className="container d-flex justify-content-center">
                        <a href="/search"><button className="btn btn-outline-dark">Search by name</button></a></div>
                        : 
                        null
                    }
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
                 {this.state.showEntities ? 
                     <div onChange={this.setSelection.bind(this)}>
                    We found 2 potential matches:<div></div>
                     <input type="radio" value="val1" name="gender"/> Name: {this.state.val1.name}, Age: {this.state.val1.age}, Address: {this.state.val1.address}, Phone Number: {this.state.val1.phoneNumber}<div></div>
                     <input type="radio" value="val2" name="gender"/> Name: {this.state.val2.name}, Age: {this.state.val2.age}, Address: {this.state.val2.address}, Phone Number: {this.state.val2.phoneNumber}<div></div>
                     <button onClick= {this.chooseEntity.bind(this)} className="btn btn-outline-dark">Select</button>
                   </div>
                   : null
                 }</div>,
                 
                 <div style={{cursor:'pointer'}} className="container d-flex justify-content-center text-center">
                {this.state.showHighScore ? 
                <Alert variant="danger" onClick= {this.displayResults.bind(this)}>
                <h4>{this.state.val2.name}</h4>
                <p>You belong to the baby boomer generation. Based on the personally identifiable information we found, we determined that you have a <b>high</b> privacy exposure rating relative to your age group. Click to find out more.</p>
                </Alert>
                    : 
                    null}
                    </div>,
                    <div style={{cursor:'pointer'}} className="container d-flex justify-content-center text-center">
                    {this.state.showMediumScore ? 
                        <Alert variant="warning" onClick= {this.displayResults.bind(this)}>
                        <h4>Chris Paul</h4>
                        <p>You belong to the millenial generation. Based on the personally identifiable information we found, we determined that you have a <b>medium</b> privacy exposure rating relative to your age group. Click to find out more.</p>
                        </Alert>
                        : 
                        null}
                        </div>,
                 <div className="container d-flex justify-content-center">
                 <h3>{this.state.line1}</h3>
                    </div>,
                    <div className="container d-flex justify-content-center">
                    <p>{this.state.line2}</p>
                    <p><b>{this.state.line3}</b></p>
                    </div>,
                <div className="container d-flex justify-content-center">
                    <DisplayResults ref={this.DisplayResults}/>
                </div>,
                 <div className="container d-flex justify-content-center">
                 {this.state.showResults ? 
                     <button className="btn btn-primary" onClick= {() => this.setState({showplot:true,showResults:false})}> See how your score compares </button> 
                     : null
                 }</div>,
                <div className="container d-flex justify-content-center">
                {this.state.showplot ? 
                    <iframe id="igraph" scrolling="no" seamless="seamless" srcDoc={this.state.plot} height="525" width="60%"></iframe> 
                    : null
                }</div> 
                    

        ]
    }
}

export default Homepage;
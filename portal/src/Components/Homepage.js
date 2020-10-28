import React from 'react';
import DisplayResults from './DisplayResults.js'
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';
import EmailDataService from "../services/email.service";
import axios from "axios";

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
          showAdditionalCriteria: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleZipChange = this.handleZipChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleShowAdditionalCriteria = this.handleShowAdditionalCriteria.bind(this);
        this.handleAdditionalCriteriaSearchBad = this.handleAdditionalCriteriaSearchBad.bind(this);
        this.queryMongoEmail = this.queryMongoEmail.bind(this);
        this.DisplayResults = React.createRef();
      }

    handleSubmit(event) {
        event.preventDefault();
        this.DisplayResults.current.setState(initialResultsState)
        //query data base and surface web
        //display returned results
        if(this.state.emailValue.length > 0) {
            this.DisplayResults.current.setState({
                email: true,
                address: true,
                password: true,
                phoneNumber: true,
                zip: true,
                ssn: true,
                databreach_sources: ['last.fm'],
                surfaceweb_sources: ['mylife', 'that\'s them']

            })
        }
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

    handleAdditionalCriteriaSearchBad(event) {
        
        EmailDataService.getAll()
        .then(response => {
            //alert(response.data);
            console.log(response.data[0]);
            var responselength = response.data.length
            var wehave = false;
            for(var i = 0; i < responselength; i++) {
                var item = response.data[i]
                if(this.state.emailValue == item.email) {
                    alert("we have your email in database under the name: "+item.name)
                    wehave = true
                }
            }
            if(!wehave) {
                alert("we do not have your email in database")
            }
        }).catch(e => {
            console.log(e);
        });
        event.preventDefault();
    }

    queryMongoEmail(event) {
        if(this.state.emailValue.length > 0){
            EmailDataService.get(this.state.emailValue)
            .then(response => {
                console.log(response.data);
                alert("we have your email in database under the name: "+response.data.name)
            }).catch(e => {
                console.log(e);
                alert("we do not have your email stored in the database")
            });

            event.preventDefault();
        }
    }

    render() {
        return [
                
                <div className="jumbotron text-center">
                    <h1>AZSecure Privacy Portal</h1>
                    <p>Search. Know. Act.</p>
                </div>,
                <div>
                    {this.state.showAdditionalCriteria ? 
                        <AdditionalCriteria nameValue={this.state.nameValue} zipValue={this.state.zipValue} phoneValue={this.state.phoneValue} emailValue={this.state.emailValue}
                                            handleNameChange={this.handleNameChange} handleZipChange={this.handleZipChange} handlePhoneChange={this.handlePhoneChange} 
                                            handleEmailChange={this.handleEmailChange} onClickSubmit={this.queryMongoEmail}
                        /> 
                        : 
                        <DefaultCriteria emailValue={this.state.emailValue} handleChange={this.handleEmailChange} handleSubmit={this.queryMongoEmail}/>
                    }
                </div>,
                <div className="container d-flex justify-content-center">
                    <button className="btn btn-outline-dark" onClick={this.handleShowAdditionalCriteria}>Search by additional criteria</button>
                </div>,
                <div className="container d-flex justify-content-center">
                    <DisplayResults ref={this.DisplayResults}/>
                </div>

        ]
    }
}

export default Homepage;
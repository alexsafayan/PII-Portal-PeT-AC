import React from 'react';
import DisplayResults from './DisplayResults.js'
import EmailDataService from "../services/email.service";
import Alert from 'react-bootstrap/Alert'
import GaugeChart from 'react-gauge-chart'
import PuffLoader from "react-spinners/PuffLoader";

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
{/*            <input style={{marginBottom: '10px'}} id="phoneSearc" className="form-control" type="search" placeholder="Enter phone number" aria-label="Search" value={props.phoneValue} onChange={props.handlePhoneChange}/> */}
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
          showSearch: true,
          showSearchAgain: false,
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
          showSearchByEmail: true,
          es: "",
          score: 0
        };
        this.callDisplay = this.callDisplay.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleZipChange = this.handleZipChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleShowAdditionalCriteria = this.handleShowAdditionalCriteria.bind(this);
        this.chooseEntity = this.chooseEntity.bind(this);
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
        this.setState({
            errorMessage: "",
            line1: "",
            showEntities: false,
            showHighScore: false,
            showMediumScore: false,
            showLowScore: false,
            score: 0
        });
        this.DisplayResults.current.setState({
            show: false,
            score: 0
        });
        if(this.state.nameValue.length > 0 && (this.state.zipValue.length > 0 || this.state.phoneValue.length > 0)){
            this.setState({
                showSearch: false,
                showLoader: true,
                showSearchByEmail: false,
            })
            EmailDataService.getData(this.state.nameValue, this.state.zipValue)
            .then(response => {
                // console.log("response:");
                // console.log(response);
                var entities = []
                var sources = []
                var dates = []
                //alert("we have your name and zip in database")
                if(response.status === 202) {
                    for(var i = 0; i < response.data.entities.length; i++) {
                        entities.push(response.data.entities[i])
                        sources.push(response.data.sources[i])
                        dates.push(response.data.dates[i])
                    }
                    console.log("entities, sources: ")
                    console.log(entities)
                    console.log(sources)
                    console.log(dates)
                    var es = "es"
                    if(entities.length == 1) {
                        es = ""
                    }
                    this.setState({
                        showEntities: true,
                        showLoader: false,
                        entities: entities,
                        sources: sources,
                        datesCollected: dates,
                        es: es,
                    })
                    return true;
                } else if(response.status === 204) {
                    this.setState({
                        showLoader: false,
                        line1: "We do not have any record of your information being compromised.",
                        line2: "",
                        line3: "",
                        showSearchAgain: true
                    })
                    return false
                }
            }).catch(e => {
                console.log("in hizzere2")
                console.log(e);
                //alert("we do not have your name and zip stored in the database")
                
            });
        }
        else {
            console.log("invalid entry")
            this.setState({
                errorMessage: "Please enter name and at least one other attribute."
            })
        }
        event.preventDefault();
    }

    callDisplay(entity, sources, datesCollected) {
        this.DisplayResults.current.setState({entity: null, sources:null,datesCollected:null})
        //display returned results
        console.log("in calldisplay")
        console.log(entity)
        console.log(sources)
        this.DisplayResults.current.setState({
            entity: entity,
            sources: sources,
            datesCollected: datesCollected,
            score: entity.score
        })
        if(entity.score<1.6){
            this.setState({
                showMediumScore: true
            })
        }
        else if(entity.score>8.4){
            this.setState({
                showHighScore: true
            })
        }
        else {
            this.setState({
                showMediumScore: true
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

    setSelection(event) {
        console.log(event.target.value);
        this.setState({
            selectedValue: event.target.value
        });
    }
    
    chooseEntity(id, event) {
        event.preventDefault();
        console.log("selected value: "+id)
        this.setState({
            selectedValue: id,
            entityInd: id,
            showEntities: false,
            showSearchAgain: true
        })
        this.callDisplay(this.state.entities[id],this.state.sources[id],this.state.datesCollected[id])
        
    }


    goBack(event) {
        console.log("in the go back funct")
        this.setState({
            showEntities: true, entityInd:-1, showMediumScore:false, showHighScore:false,showLowScore:false, showSearchAgain: false
        });
        this.DisplayResults.current.setState({
            show: false,
            score: 0
        });
    }

    render() {
        return [
                <div>
                    {this.state.showSearch ? 
                    <div>
                        <AdditionalCriteria nameValue={this.state.nameValue} zipValue={this.state.zipValue} phoneValue={this.state.phoneValue} emailValue={this.state.emailValue}
                                            handleNameChange={this.handleNameChange} handleZipChange={this.handleZipChange} handlePhoneChange={this.handlePhoneChange} 
                                            handleEmailChange={this.handleEmailChange} onClickSubmit={this.handleSubmit}
                        /> 
                    </div> : null}
                </div>,

                <div className="container d-flex justify-content-center">
                    {this.state.showLoader ? <PuffLoader color={"#000000"} loading={true} size={150} />: null}
                </div>,

                // <div>
                //     {this.state.showSearchByEmail ? 
                //         <div className="container d-flex justify-content-center">
                //             <a href="/search"><button className="btn btn-outline-dark">Search by email</button></a></div>
                //         : 
                //         null
                //     }
                // </div>,

                <div className="container d-flex justify-content-center">
                    {this.state.errorMessage.length == 0 ? null
                    : 
                    <Alert variant="danger">
                        <p>
                            {this.state.errorMessage}
                        </p>
                    </Alert>}
                </div>,
                
                <div style={{cursor:'pointer'}} className="container">
                    {this.state.showHighScore ? 
                    <div className="row justify-content-center text-center">
                        <Alert variant="danger">
                            <h4>{this.state.entities[this.state.entityInd].name}</h4>
                            <p>You belong to {this.state.entities[this.state.entityInd].agebucket}. Based on the personally identifiable information we found, we determined that you have a <b>high</b> privacy exposure rating relative to your age group.</p>
                        </Alert>
                    </div>
                    : null}
                </div>,

                <div style={{cursor:'pointer'}} className="container">
                   {this.state.showMediumScore ? 
                   <div className="row justify-content-center text-center">
                        <Alert variant="warning">
                            <h4>{this.state.entities[this.state.entityInd].name}</h4>
                            <p>You belong to {this.state.entities[this.state.entityInd].agebucket}. Based on the personally identifiable information we found, we determined that you have a <b>medium</b> privacy exposure rating relative to your age group.</p>
                        </Alert>
                    </div>
                    : null}
                </div>,

                 <div className="container d-flex justify-content-center">
                    <h3>{this.state.line1}</h3>
                </div>,

                <div className="container d-flex justify-content-center">
                    <p>{this.state.line2}</p>
                    <p><b>{this.state.line3}</b></p>
                </div>,

                <div>
                    {this.state.entityInd >=0 ? 
                        <div className="row">
                            <div className="col">
                            </div>
                        <div className="col">
                            <GaugeChart 
                                id="gauge-chart2" 
                                nrOfLevels={3} 
                                percent={this.state.entities[this.state.entityInd].score / 10}
                                textColor={"#000000"} 
                                arcsLength={[0.159, 0.682, 0.159]}
                                style={{width:'100%'}}
                                arcPadding={0}
                                cornerRadius={2}
                            />
                        </div>
                        <div className="col">
                        </div>
                        </div>
                    : null}
                </div>,

                <div className="container d-flex justify-content-center">
                    <DisplayResults ref={this.DisplayResults}/> 
                    
                </div>,
                <div className="container">
                {this.state.showEntities ? 
                    <div>
                    <h1 className="text-center">We found {this.state.entities.length} potential match{this.state.es}:</h1>
                    <div className="row">
                    {this.state.entities.map((value, index) => {
                        return <div className="col-4" style={{paddingBottom: "10px"}}>
                            <div className="card" style={{paddingBottom: "10px"}}>
                                <div className="card-body" style={{paddingBottom: "10px"}}>
                                <h5 className="card-title">{value.name}</h5>
                                <p className="card-text">Phone number: {value.phoneNumber}</p>
                                <p className="card-text">Birthyear: {value.birthyear}</p>
                                <a onClick={(e) => this.chooseEntity(index, e)} className="btn btn-secondary">Select</a>
                                </div>
                            </div>
                        </div>
                    })}
                    </div>
                    </div>
                    : null
                }
                </div>,
                <div className="container">
                    <div className="row">
                        <div className="col-4"></div>
                        <div className="col-2">
                            {this.state.showSearchAgain ? <a href="/search"><button className="btn btn-outline-dark">Search Again</button></a> 
                            : null
                            }
                        </div>
                        <div className="col-2">
                            {this.state.entityInd >=0 ? 
                            <button onClick={this.goBack.bind(this)} className="btn btn-secondary">Back To Results</button>
                            : null
                            }
                        </div>
                        <div className="col-4"></div>
                    </div>
                </div>

        ]
    }
}

export default Search;
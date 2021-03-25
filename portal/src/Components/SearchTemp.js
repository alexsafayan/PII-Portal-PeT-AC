import React from 'react';
import DisplayResults from './DisplayResults.js'
import EmailDataService from "../services/email.service";
import Alert from 'react-bootstrap/Alert'
import GaugeChart from 'react-gauge-chart'
import PuffLoader from "react-spinners/PuffLoader";
import BeatLoader from "react-spinners/BeatLoader";
import { SiCheckmarx } from "react-icons/si";

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
          showSearchByEmail: true,
          showDbResponse: false,
          es: "",
          dbComplete: false,
          surfaceSearchComplete: false,
          searchAgainClass: "col-4"
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
                loaderMessage: "Searching breached records ",
                showSearchByEmail: false,
            })
            EmailDataService.getByName(this.state.nameValue, this.state.zipValue)
            .then(response => {
                // console.log("response.data:");
                // console.log(response.data);
                if(response.status === 202) {
                    var dbResponse = response.data.dbResponse;
                    var es = ""
                    if(dbResponse.length != 1) {
                        es = "s"
                    }
                    this.setState({
                        showDbResponse: true,
                        showLoader: false,
                        loaderMessage: "Searching surfaceweb",
                        dbAmount: 1,
                        dbResponse: dbResponse,
                        sendBack: response.data.uneditedResponses,
                        es: es,
                        showSearchAgain: true
                    })
                    return true
                } else if(response.status === 204) {
                    this.setState({
                        showLoader: false,
                        showSurfaceWebResponse: false,
                        line1: "We do not have any record of your information being compromised.",
                        line2: "",
                        line3: "",
                        showSearchAgain: true,
                        searchAgainClass: "col-5"
                    })
                    return false
                }
            }).catch(e => {
                console.log("error in first api call")
                console.log(e);
                this.setState({
                    showLoader: false,
                    showSurfaceWebResponse: false,
                    line1: "We do not have any record of your information being compromised.",
                    line2: "",
                    line3: "",
                    showSearchAgain: true,
                })
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
        this.setState({
            selectedValue: event.target.value
        });
    }
    
    chooseDbResponse(id, event) {
        event.preventDefault();
        var sendBack = this.state.sendBack[id]
        this.setState({
            sendBack: sendBack,
            showDbResponse: false,
            showLoader: true,
            showSearchAgain: false
        })
        EmailDataService.searchSurfaceWeb(this.state.nameValue, this.state.zipValue)
        .then(response => {
            console.log("response2: ")
            console.log(response)
            var entities = []
            var sources = []
            var dates = []
            if(response.status === 202) {
                var surfaceWebResponse = response.data.surfaceWebResponse
                this.setState({
                    showSurfaceWebResponse: false,
                    surfaceSearchComplete: true,
                    surfaceWebResults: surfaceWebResponse,
                    loaderMessage: "Resolving Entities"
                })
                EmailDataService.resolveEmail(this.state.sendBack, response.data.return)
                .then(finalResponse => {
                    // console.log("final resp: ")
                    // console.log(finalResponse)
                    var entities = []
                    var sources = []
                    var dates = []
                    //alert("we have your name and zip in database")
                    if(finalResponse.status === 202) {
                        for(var i = 0; i < finalResponse.data.entities.length; i++) {
                            entities.push(finalResponse.data.entities[i])
                            sources.push(finalResponse.data.sources[i])
                            dates.push(finalResponse.data.dates[i])
                        }
                        // console.log("entities, sources: ")
                        // console.log(entities)
                        // console.log(sources)
                        // console.log(dates)
                        this.setState({
                            surfaceSearchComplete: false,
                            dbComplete: false,
                            showSurfaceWebResponse: false,
                            showLoader: false,
                            showSearchAgain: true
                        })
                        this.callDisplay(entities[0],sources[0],dates[0])
                        return true;
                    } else if(finalResponse.status === 204) {
                        this.setState({
                            showLoader: false,
                            line1: "We do not have any record of your information being compromised.",
                            line2: "",
                            line3: "",
                            surfaceSearchComplete: false,
                            showSearchAgain: true,
                            searchAgainClass: "col-5"
                        })
                        return false
                    }
                }).catch(e => {
                    console.log("error on third api call")
                    console.log(e);
                    this.setState({
                        showLoader: false,
                        showSurfaceWebResponse: false,
                        line1: "We do not have any record of your information being compromised.",
                        line2: "",
                        line3: "",
                        showSearchAgain: true,
                        surfaceSearchComplete: false,
                        searchAgainClass: "col-5"
                    })
                    //alert("we do not have your name and zip stored in the database")
                    
                });
                return true;
            } else if(response.status === 204) {
                this.setState({
                    showLoader: false,
                    line1: "We do not have any record of your information being compromised.",
                    line2: "",
                    line3: "",
                    surfaceSearchComplete: false,
                    showSearchAgain: true,
                    searchAgainClass: "col-5"
                })
                return false
            }
        }).catch(e => {
            console.log("error on second api call")
            console.log(e);
            this.setState({
                showLoader: false,
                showSurfaceWebResponse: false,
                line1: "We do not have any record of your information being compromised.",
                line2: "",
                line3: "",
                showSearchAgain: true,
                surfaceSearchComplete: false,
                searchAgainClass: "col-5"
            })
            //alert("we do not have your name and zip stored in the database")
            
        });
        
    }

    chooseEntity(id, event) {
        event.preventDefault();
        this.setState({
            selectedValue: id,
            entityInd: id,
            showEntities: false,
            showSearchAgain: true,
            searchAgainClass: "col-4"
        })
        this.callDisplay(this.state.entities[id],this.state.sources[id],this.state.datesCollected[id])
        
    }

    callDisplay(entity, sources, datesCollected) {
        this.DisplayResults.current.setState({entity: null, sources:null,datesCollected:null})
        //display returned results
        // console.log("in calldisplay")
        // console.log(entity)
        // console.log(sources)
        this.DisplayResults.current.setState({
            entity: entity,
            sources: sources,
            datesCollected: datesCollected,
            score: entity.score,

        })
        if(entity.score<1.6){
            this.setState({
                showLowScore: true,
                entity: entity,
                source: sources,
                dates: datesCollected,
                entityInd: 0
            })
        }
        else if(entity.score>8.4){
            this.setState({
                showHighScore: true,
                entity: entity,
                source: sources,
                dates: datesCollected,
                entityInd: 0
            })
        }
        else {
            this.setState({
                showMediumScore: true,
                entity: entity,
                source: sources,
                dates: datesCollected,
                entityInd: 0
            })
        }
    }

    goBack(event) {
        console.log("in the go back funct")
        this.setState({
            showEntities: true, entityInd:-1, showMediumScore:false, showHighScore:false,showLowScore:false, showSearchAgain: false, searchAgainClass: "col-5"
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
                    {this.state.errorMessage.length === 0 ? null
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
                            <h4>{this.state.entity.name}</h4>
                            <p>You belong to {this.state.entity.agebucket}. Based on the personally identifiable information we found, we determined that you have a <b>high</b> privacy exposure rating relative to your age group.</p>
                        </Alert>
                    </div>
                    : null}
                </div>,

                <div style={{cursor:'pointer'}} className="container">
                   {this.state.showMediumScore ? 
                   <div className="row justify-content-center text-center">
                        <Alert variant="warning">
                            <h4>{this.state.entity.name}</h4>
                            <p>You belong to {this.state.entity.agebucket}. Based on the personally identifiable information we found, we determined that you have a <b>medium</b> privacy exposure rating relative to your age group.</p>
                        </Alert>
                    </div>
                    : null}
                </div>,

                <div style={{cursor:'pointer'}} className="container">
                   {this.state.showLowScore ? 
                   <div className="row justify-content-center text-center">
                        <Alert variant="success">
                            <h4>{this.state.entity.name}</h4>
                            <p>You belong to {this.state.entity.agebucket}. Based on the personally identifiable information we found, we determined that you have a <b>low</b> privacy exposure rating relative to your age group.</p>
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
                                percent={this.state.entity.score / 10}
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
                <div className="container justify-content-center">
                {this.state.showDbResponse ? 
                    <div>
                    <h1 className="text-center">We found {this.state.dbResponse.length} result{this.state.es} in our breached records:</h1>
                    <div className="row">
                    {this.state.dbResponse.map((value, index) => {
                        return <div className="col-4" style={{paddingBottom: "10px"}}>
                            <div className="card" style={{paddingBottom: "10px"}}>
                                <div className="card-body" style={{paddingBottom: "10px"}}>
                                <h5 className="card-title">{value.name}</h5>
                                <p className="card-text">Phone number: {value.phoneNumber}</p>
                                <p className="card-text">Birthyear: {value.birthyear}</p>
                                <p className="card-text">Source: {value.platform}</p>
                                <a onClick={(e) => this.chooseDbResponse(index, e)} className="btn btn-secondary">Select</a>
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
                {this.state.dbComplete && 
                    <div>
                    <h2 className="text-center">Searching breached records <SiCheckmarx/></h2>
                    </div>
                }
                </div>,

                <div className="container">
                {this.state.surfaceSearchComplete && 
                    <div>
                    <h2 className="text-center">Searching surface web <SiCheckmarx/></h2>
                    </div>
                }
                </div>,

                <div className="container d-flex justify-content-center">
                    {this.state.showLoader ? 
                    <div> 
                        <h2>{this.state.loaderMessage}<BeatLoader color={"#000000"} loading={true} size={20} /> </h2>
                        
                    </div>
                    
                    : null}

                </div>,

                <div className="container">
                    <div className="row">
                        <div className="col-5"></div>
                        {this.state.showSearchAgain && 
                            <div className="col-4">
                                <a href="/search"><button className="btn btn-outline-dark">Search Again</button></a> 
                            </div>
                        }
                        <div className="col-2"></div>
                    </div>
                </div>

        ]
    }
}

export default Search;
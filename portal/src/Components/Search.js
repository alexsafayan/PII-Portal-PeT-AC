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
          score: 0
        };
        this.callDisplay = this.callDisplay.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleZipChange = this.handleZipChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleShowAdditionalCriteria = this.handleShowAdditionalCriteria.bind(this);
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
            //this.queryMongoName();
            this.setState({
                showSearch: false,
                showLoader: true,
                showSearchByEmail: false,
            })
            EmailDataService.getData(this.state.nameValue, this.state.zipValue)
            .then(response => {
                console.log("response:");
                console.log(response);
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
                    // entities.push(response.data.entities[0])
                    // sources.push(response.data.sources[0])
                    // dates.push(response.data.dates[0])
                    // entities.push({address: true, age: 26,agebucket: "the millenial generation",birthday: true,currentTown: true,dateCollected: "2017-07-07 17:56:15"
                    //     ,email: true,hometown: true,interests: false,jobDetails: false,medianscore: 3.3,name: "Mickey Pizzone",phoneNum: true,phoneNumber: "954-***-****",platform: "TorMarket"
                    //     ,politicalViews: false,relationshipStatus: false,religiousViews: false,score: 4.8,zip: "33***",percentile:.93})
                    // sources.push(response.data.sources[0])
                    // dates.push(response.data.dates[0])
                    console.log("entities, sources: ")
                    console.log(entities)
                    console.log(sources)
                    console.log(dates)
                    this.setState({
                        showEntities: true,
                        showLoader: false,
                        entities: entities,
                        sources: sources,
                        datesCollected: dates
                    })
                    return true;
                } else if(response.status === 204) {
                    this.setState({
                        showLoader: false,
                        line1: "We do not have any record of your information being compromised.",
                        line2: "",
                        line3: ""
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
        if(entity.percentile<.16){
            this.setState({
                showMediumScore: true
            })
        }
        else if(entity.percentile>.84){
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

    callDisplayb(updated_state) {
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
            sources: updated_state.platform,
            medianscore: updated_state.medianscore,
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

    queryMongoName(event) {
        if(this.state.nameValue.length > 0 && this.state.zipValue > 0){
            console.log(this.state.nameValue);
            this.setState({
                showSearch: false,
                showLoader: true,
                showSearchByName: false,
            })
            EmailDataService.getData(this.state.nameValue, this.state.zipValue)
            .then(response => {
                console.log("response:");
                console.log(response);
                var entities = []
                var sources = []
                var dates = []
                //alert("we have your name and zip in database")
                if(response.status === 202) {
                    entities.push(response.data.entities[0])
                    sources.push(response.data.sources[0])
                    dates.push(response.data.dates[0])
                    entities.push({address: true, age: 26,agebucket: "the millenial generation",birthday: true,currentTown: true,dateCollected: "2017-07-07 17:56:15"
                        ,email: true,hometown: true,interests: false,jobDetails: false,medianscore: 3.3,name: "Mickey Pizzone",phoneNum: true,phoneNumber: "954-***-****",platform: "TorMarket"
                        ,politicalViews: false,relationshipStatus: false,religiousViews: false,score: 4.8,zip: "33***",percentile:.93})
                    sources.push(response.data.sources[0])
                    dates.push(response.data.dates[0])
                    console.log("entities, sources: ")
                    console.log(entities)
                    console.log(sources)
                    console.log(dates)
                    this.setState({
                        showEntities: true,
                        showLoader: false,
                        entities: entities,
                        sources: sources,
                        datesCollected: dates
                    })
                    return true;
                } else if(response.status === 204) {
                    this.setState({
                        showLoader: false,
                        line1: "We do not have any record of your information being compromised.",
                        line2: "",
                        line3: ""
                    })
                    return false
                }
            }).catch(e => {
                console.log("in hizzere2")
                console.log(e);
                //alert("we do not have your name and zip stored in the database")
                
            });

            //event.preventDefault();
        }

    }

    setSelection(event) {
        console.log(event.target.value);
        this.setState({
            selectedValue: event.target.value
        });
    }
    
    chooseEntity(event) {
        console.log("selected value: "+this.state.selectedValue)
        this.setState({
            entityInd: this.state.selectedValue,
            showEntities: false
        })
        this.callDisplay(this.state.entities[this.state.selectedValue],this.state.sources[this.state.selectedValue],this.state.datesCollected[this.state.selectedValue])
        //event.preventDefault();
    }
    //searches database for address and name CONTAINING name and zip values
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

            if(response.status == 202) {
                this.callDisplay(response.data);
                this.setState({
                    showResults: true,
                    //email: true,
                    line1: "Your name and zip are compromised!",
                    line2: "",
                    line3: ""
                })
                return true;
            }
            else if (response.status == 204) {
                this.setState({
                    line1: "We do not have your name and zip in our database. Please continue browsing safely!",
                    line2: "",
                    line3: ""
                })
                return false
            }
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

                <div>
                    {this.state.showSearchByEmail ? 
                        <div className="container d-flex justify-content-center">
                            <a href="/search"><button className="btn btn-outline-dark">Search by email</button></a></div>
                        : 
                        null
                    }
                </div>,

                <div className="container d-flex justify-content-center">
                    {this.state.errorMessage.length == 0 ? null
                    : 
                    <Alert variant="danger">
                        <p>
                            {this.state.errorMessage}
                        </p>
                    </Alert>}
                </div>,

                <div className="container d-flex flex-row p2 justify-content-center">
                    {this.state.showEntities ? 
                        <div onChange={this.setSelection.bind(this)}>
                        We found {this.state.entities.length} potential matches:<div></div>
                        {this.state.entities.map((value, index) => {
                            return <div><input type="radio" value={index} key={index} name="entity"/> Name: {value.name}, Age: {value.age}, Phone Number: {value.phoneNumber}</div>
                        })}
                        <button onClick= {this.chooseEntity.bind(this)} className="btn btn-outline-dark">Select</button>
                        </div>
                        : null
                    }
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
                                percent={this.state.entities[this.state.entityInd].percentile}
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
                </div>

        ]
    }
}

export default Search;
import React from 'react';
import DisplayResults from './DisplayResults.js'
import EmailDataService from "../services/email.service";
import Alert from 'react-bootstrap/Alert'
import GaugeChart from 'react-gauge-chart'
import PuffLoader from "react-spinners/PuffLoader";


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
          showEntities: false,
          showHighScore: false,
          showMediumScore: false,
          showLowScore: false,
          showSearchByName: true,
          showSearch: true,
          showLoader: false,
          entityInd: -1,
          selectedValue: "",
          entities: [],
          sources: [],
          score: 0
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleZipChange = this.handleZipChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleShowAdditionalCriteria = this.handleShowAdditionalCriteria.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
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

        console.log("in handle submit");
        if(this.validateEmail(this.state.emailValue)) {

            console.log("email is valid")
            this.setState({
                showSearch: false,
                showLoader: true,
                showSearchByName: false,
            })
            EmailDataService.get(this.state.emailValue)
            .then(response => {
                var entities = []
                var sources = []
                // need a for each loop here to push all returned entities
                entities.push(response.data.entities[0])
                sources.push(response.data.sources[0])
                entities.push({address: true, age: 26,agebucket: "the millenial generation",birthday: true,currentTown: true,dateCollected: "2017-07-07 17:56:15"
                    ,email: true,hometown: true,interests: false,jobDetails: false,medianscore: 3.3,name: "Mickey Pizzone",phoneNum: true,phoneNumber: "954-***-****",platform: "TorMarket"
                    ,politicalViews: false,relationshipStatus: false,religiousViews: false,score: 4.8,zip: "33***",percentile:.93})
                sources.push(response.data.sources[0])
                console.log("entities, sources: ")
                console.log(entities)
                console.log(sources)
                
                if(response.status === 202) {
                    this.setState({
                        showEntities: true,
                        showLoader: false,
                        entities: entities,
                        sources: sources,
                    })
                    return true;
                } else if(response.status === 204) {
                    this.setState({
                        showLoader: false,
                        line1: "We do not have any record of your email being compromised.",
                        line2: "",
                        line3: ""
                    })
                    return false
                }
            }).catch(e => {
                console.log(e);
                this.setState({
                    showLoader: false,
                    line1: "We do not have any record of your email being compromised.",
                    line2: "",
                    line3: ""
                })
                return false
            });
        }
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
        this.setState({
            selectedValue: event.target.value
        });
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
        this.setState({
            entityInd: this.state.selectedValue,
            showEntities: false
        })
        this.callDisplay(this.state.entities[this.state.selectedValue],this.state.sources[this.state.selectedValue])
        //event.preventDefault();
    }

    callDisplay(entity, sources) {
        this.DisplayResults.current.setState({entity: null, sources:null})
        //display returned results
        console.log("in calldisplay")
        console.log(entity)
        console.log(sources)
        this.DisplayResults.current.setState({
            entity: entity,
            sources: sources,
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

    validateEmail(email) {
        console.log("in validate email")
        //const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var re = /\S+@\S+\.\S+/;
        return re.test(String(email).toLowerCase());
    }



    render() {
        return [
                <div>
                {this.state.showSearch ? 
                <div>
                    <DefaultCriteria emailValue={this.state.emailValue} handleChange={this.handleEmailChange} handleSubmit={this.handleSubmit}/>
                </div> : null}
                </div>
                ,
                <div className="container d-flex justify-content-center">
                    {this.state.showLoader ? <PuffLoader color={"#000000"} loading={true} size={150} />: null}
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
                    {this.state.errorMessage.length === 0 ? null
                    : 
                    <Alert variant="danger">
                        <p>{this.state.errorMessage}</p>
                    </Alert>
                    }
                </div>,   

                <div className="container d-flex justify-content-center">
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

                <div className="container d-flex justify-content-center">
                    <DisplayResults ref={this.DisplayResults}/>
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

                <div>
                    {this.state.showSearch ? null : null}
                </div>
                    

        ]
    }
}

export default Homepage;
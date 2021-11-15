import React from 'react';
import GaugeChart from 'react-gauge-chart';
import { IoMdArrowRoundBack } from "react-icons/io";
import { GoArrowRight } from "react-icons/go";
import Alert from 'react-bootstrap/Alert';
import ReactLoading from 'react-loading';

import '../App.css'
import DisplayResults, { ResultsTable, DatabaseTable } from '../Components/DisplayResults.js';
import EmailDataService from "../services/email.service";
// import SubscribeModal from '../Components/Sub.js';
import Searchbar from "../Components/Searchbar";
// import GoodNews from "../Components/GoodNews";
import BadNewsEmail from "../Components/BadNewsEmail";
// import DatabaseResponse from "../Components/DatabaseResponse";



class Homepage extends React.Component {

    

    constructor(props) {
        super(props);
        this.state = {
          surfaceWebResults: [],
          surfaceWebResponse_clean: [],
          surfaceWebAttributesLists: [],
          numBreaches: "",
          numEmails: "2,730,903,926",
          numNames: "11,068,457",
          showBreachTotals: true,
          showProtectYourself: true,
          results: "",
          searchValue: "",
          nameValue: "",
          zipValue: "",
          errorMessage: "",
          dbComplete: false,
          showSearchByName: true,
          showSearch: true,
          showSearchAgain: false,
          showLoader: false,
          showLoaders: false,
          entityInd: -1,
          selectedValue: "",
          entities: [],
          sources: [],
          datesCollected: [],
          score: 0,
          amountBreached: 0,
          breaches: [],
          fieldName: 'Name + Zip',
          loaderType: 'spokes',
          mcaDescription: "AI powered entity matching model.",
          red: "#ff9c9c",
          green: "#78ac44",
          searchEngines: {
                'anywho': {'color': "#ff9c9c", 'text': '', 'hasArrow': true}, 
                'zabasearch': {'color': "#ff9c9c", 'text': '', 'hasArrow': true}, 
                'mylife': {'color': "#ff9c9c", 'text': '', 'hasArrow': true}, 
                'peekyou': {'color': "#ff9c9c", 'text': '', 'hasArrow': true}, 
                'spokeo': {'color': "#ff9c9c", 'text': '', 'hasArrow': false}}
          
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAgeCheck = this.handleAgeCheck.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        // this.selectField = this.selectField.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.displayGoodNews = this.displayGoodNews.bind(this);
        this.showPredictions = this.showPredictions.bind(this);
        this.organizePredictionTable = this.organizePredictionTable.bind(this);
        this.Modal = React.createRef()
      }

    subscribe() {
        this.Modal.current.setState(
            {
                show:true
            }
        )
    }
    
    handleSubmit(fieldName,searchValue,nameValue,zipValue, event) {
        this.setState({
            errorMessage: "",
            line1: "",
            showScore: false,
            showScoreEmail: false,
            score: 0,
            showGoodNews: false,
            showBadNews: false,
            showPredictions: false,
            showEmail: false,
            searchState: fieldName,
            fieldName: fieldName,
            searchValue: searchValue,
            nameValue:nameValue,
            zipValue: zipValue
        });
        //email search
        if(fieldName === 'Email') {
            if(this.validateEmail(searchValue)) {
                console.log("email is valid")
                this.setState({
                    // showSearch: false,
                    showLoader: true,
                    loaderMessage: "Searching breached records",
                    showSearchByName: false,
                    showBreachTotals: false,
                    showProtectYourself: false,
                })
                EmailDataService.getByEmail(searchValue)
                .then(response => {
                    if(response.status === 202) {
                        console.log("response:")
                        console.log(response)
                        this.setState({
                            dbComplete: true,
                            loaderMessage: "Searching surface web",
                            dbResponse: response.data.dbResponse,
                            
                        })
                        EmailDataService.searchSurfaceWebEmail(searchValue, response.data.dbResponse)
                        .then(response2 => {
                            console.log("response2: ")
                            console.log(response2)
                            //alert("we have your name and zip in database")
                            if(response2.status === 202) {
                                var entities = []
                                var sources = []
                                var dates = []
                                var exposedAttributesList = []
                                var exposedAttributesVals = []
                                for(var i = 0; i < response2.data.entities.length; i++) {
                                    entities.push(response2.data.entities[i])
                                    sources.push(response2.data.sources[i])
                                    dates.push(response2.data.dates[i])
                                    exposedAttributesList.push(response2.data.exposedAttributesList[i])
                                    exposedAttributesVals.push(response2.data.exposedAttributesVals[i])
                                }
                                this.setState({
                                    dbComplete: false,
                                    showSurfaceWebResponse: false,
                                    showLoader: false,
                                    entities: entities,
                                    sources: sources,
                                    datesCollected: dates,
                                })
                                this.callDisplay(entities[0],sources[0],dates[0],exposedAttributesList[0],exposedAttributesVals[0])
                                return true;
                            } else if(response2.status === 204) {
                                this.setState({
                                    showLoader: false,
                                    dbComplete: false,
                                    showBadNews: true,
                                    showProtectYourself: true,
                                    showSearchAgain: true,
                                    searchAgainClass: "col-5"
                                })
                                return false
                            }
                        }).catch(e => {
                            console.log("error on second api call")
                            console.log(e);
                            //alert("we do not have your name and zip stored in the database")
                            
                        });
                        return true;
                    } else if(response.status === 204) {
                        this.setState({
                            showLoader: false,
                            dbComplete: false,
                            showGoodNews: true,
                            showSearchAgain: true
                        })
                        return false
                    }else if(response.status === 201) {
                        console.log("response: ")
                        console.log(response)
                        this.setState({
                            showLoader: false,
                            showGoodNews: true,
                            showSearchAgain: true
                        })
                    }
                }).catch(e => {
                    console.log(e);
                    this.setState({
                        showLoader: false,
                        showGoodNews: true,
                        showSearchAgain: true
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
        }

        //name and zip search
        else if(fieldName === 'Name + Zip') {
            if(nameValue.length > 0 && zipValue.length >=5){
                this.setState({
                    // showSearch: false,
                    showLoader: true,
                    showBreachTotals: false,
                    showProtectYourself: false,
                    loaderMessage: "Searching breached records ",
                    showSearchByEmail: false,
                })
                EmailDataService.getByName(nameValue, zipValue)
                .then(response => {
                    console.log("db search response.data:");
                    console.log(response.data);
                    if(response.status === 202) {
                        var dbResponse = response.data.dbResponse;
                        var es = ""
                        if(dbResponse.length !== 1) {
                            es = "s"
                        }
                        // this.setState({
                        //     showDbResponse: true,
                        //     showLoader: false,
                        //     loaderMessage: "Searching surfaceweb",
                        //     dbAmount: 1,
                        //     dbResponse: dbResponse,
                        //     uneditedDbResponse: response.data.uneditedResponses,
                        //     cleanResponses: response.data.cleanResponses,
                        //     es: es,
                        //     showSearchAgain: true
                        // })
                        this.setState({
                            showLoader: false,
                            dbAmount: dbResponse.length,
                            dbResponse: dbResponse,
                            uneditedDbResponse: response.data.uneditedResponses,
                            cleanResponses: response.data.cleanResponses,
                            es: es,
                            showDbResponse: true,
                            // dbAmount: newDBResponse.length,
                            // dbResponse: newDBResponse,
                            // uneditedDbResponse: newUneditedDbResponse,
                            // cleanResponses: newCleanResponses,
                            showSearchAgain: true,
                            // showAgeCheck: true
                        })
                        return true
                    } else if(response.status === 204) {
                        this.setState({
                            showLoader: false,
                            showSurfaceWebResponse: false,
                            showGoodNews: true,
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
                        showGoodNews: true,
                        showSearchAgain: true,
                    })
                });
            }
            else {
                console.log("invalid entry")
                this.setState({
                    errorMessage: "Please enter name and a valid zip code."
                })
            }
        }
        event.preventDefault();
    }

    chooseDbResponse(id, event) {
        event.preventDefault();
        var dbResponse = this.state.dbResponse[id]
        var uneditedDbResponse = this.state.uneditedDbResponse[id]
        var cleanResponse = this.state.cleanResponses[id]
        this.setState({
            uneditedDbResponse: uneditedDbResponse,
            showDbResponse: false,
            showLoaders: true,
            showSearchAgain: false,
            dbResponse: dbResponse,
            cleanResponse: cleanResponse
        })
        EmailDataService.searchSurfaceWeb(this.state.nameValue, this.state.zipValue, "anywho", this.state.surfaceWebResults, this.state.surfaceWebResponse_clean, this.state.surfaceWebAttributesLists)
        .then(response => {
            console.log("response1: ")
            console.log(response)
            if(response.status === 202) {
                // update loaders:
                var loaders = this.state.searchEngines;
                var anywho_loader = loaders['anywho']
                anywho_loader['color'] = this.state.green
                var len = response.data.cleanResponses.length
                if (len === 1) {
                    anywho_loader['text'] = len + " record found"
                } else {
                    anywho_loader['text'] = len + " records found"
                }
                loaders['anywho'] = anywho_loader;
                console.log(' anywho loader is '+loaders['anywho'])

                
                // var surfaceWebResponse = response.data.return
                this.setState({
                    showSurfaceWebResponse: false,
                    surfaceWebResults: response.data.return,
                    surfaceWebResponse_clean: response.data.cleanResponses,
                    surfaceWebAttributesLists: response.data.surfaceWebAttributesLists,
                    searchEngines: loaders,
                    // showLoader: true,
                    // showLoaders: false,
                    // loaderMessage: "Resolving Your Identity",
                })
                EmailDataService.searchSurfaceWeb(this.state.nameValue, this.state.zipValue, "zabasearch", response.data.return, response.data.cleanResponses, response.data.surfaceWebAttributesLists)
                .then(response2 => {
                    console.log("response2: ")
                    console.log(response2)
                    // var loaders = this.state.searchEngines;
                    var zabasearch_loader = loaders['zabasearch']
                    zabasearch_loader['color'] = this.state.green
                    if(response2.status === 202) {
                        len = response2.data.cleanResponses.length - response.data.cleanResponses.length
                        if (len === 1) {
                            zabasearch_loader['text'] = len + " record found"
                        } else {
                            zabasearch_loader['text'] = len + " records found"
                        }
                        // loaders['zabasearch'] = zabasearch_loader;
                    
                        // append results to surfaceweb response and attributes list bs
                        this.setState({
                            surfaceWebResults: response2.data.return,
                            surfaceWebResponse_clean: response2.data.cleanResponses,
                            surfaceWebAttributesLists: response2.data.surfaceWebAttributesLists,
                            searchEngines: loaders
                        })
                    } else {
                        zabasearch_loader['text'] = "0 records found"
                        this.setState({
                            surfaceWebResults: response2.data.return,
                            surfaceWebResponse_clean: response2.data.cleanResponses,
                            surfaceWebAttributesLists: response2.data.surfaceWebAttributesLists,
                            searchEngines: loaders
                        })
                    }
                    console.log('sending as parameters for mylife: ')
                    console.log(response2.data.return.length)
                    console.log(response2.data.cleanResponses.length)
                    console.log(response2.data.surfaceWebAttributesLists.length)
                    EmailDataService.searchSurfaceWeb(this.state.nameValue, this.state.zipValue, "mylife", response2.data.return, response2.data.cleanResponses, response2.data.surfaceWebAttributesLists)
                    .then(response3 => {
                        console.log("response3: ")
                        console.log(response3)
                        var mylife_loader = loaders['mylife']
                        mylife_loader['color'] = this.state.green
                        if(response3.status === 202) {
                            len = response3.data.cleanResponses.length - response2.data.cleanResponses.length
                            if (len === 1) {
                                mylife_loader['text'] = len + " record found"
                            } else {
                                mylife_loader['text'] = len + " records found"
                            }
                        
                            // append results to surfaceweb response and attributes list bs
                            this.setState({
                                surfaceWebResults: response3.data.return,
                                surfaceWebResponse_clean: response3.data.cleanResponses,
                                surfaceWebAttributesLists: response3.data.surfaceWebAttributesLists,
                                searchEngines: loaders
                            })
                        } else {
                            mylife_loader['text'] = "0 records found"
                            this.setState({
                                surfaceWebResults: response3.data.return,
                                surfaceWebResponse_clean: response3.data.cleanResponses,
                                surfaceWebAttributesLists: response3.data.surfaceWebAttributesLists,
                                searchEngines: loaders
                            })
                        }
                        console.log('sending as parameters for peekyou: ')
                        console.log(response3.data.return.length)
                        console.log(response3.data.cleanResponses.length)
                        console.log(response3.data.surfaceWebAttributesLists.length)
                        EmailDataService.searchSurfaceWeb(this.state.nameValue, this.state.zipValue, "peekyou", response3.data.return, response3.data.cleanResponses, response3.data.surfaceWebAttributesLists)
                        .then(response4 => {
                            console.log("response4: ")
                            console.log(response4)
                            var peekyou_loader = loaders['peekyou']
                            peekyou_loader['color'] = this.state.green
                            if(response4.status === 202) {
                                len = response4.data.cleanResponses.length - response3.data.cleanResponses.length

                                if (len === 1) {
                                    peekyou_loader['text'] = len + " record found"
                                } else {
                                    peekyou_loader['text'] = len + " records found"
                                }
                                
                                // append results to surfaceweb response and attributes list bs
                                this.setState({
                                    surfaceWebResults: response4.data.return,
                                    surfaceWebResponse_clean: response4.data.cleanResponses,
                                    surfaceWebAttributesLists: response4.data.surfaceWebAttributesLists,
                                    searchEngines: loaders
                                })
                            } else {
                                peekyou_loader['text'] = "0 records found"
                                this.setState({
                                    surfaceWebResults: response4.data.return,
                                    surfaceWebResponse_clean: response4.data.cleanResponses,
                                    surfaceWebAttributesLists: response4.data.surfaceWebAttributesLists,
                                    searchEngines: loaders
                                })
                            }
                            console.log('sending as parameters for spokeo: ')
                            console.log(response4.data.return.length)
                            console.log(response4.data.cleanResponses.length)
                            console.log(response4.data.surfaceWebAttributesLists.length)
                            EmailDataService.searchSurfaceWeb(this.state.nameValue, this.state.zipValue, "spokeo", response4.data.return, response4.data.cleanResponses, response4.data.surfaceWebAttributesLists)
                            .then(response5 => {
                                console.log("response5: ")
                                console.log(response5)
                                var spokeo_loader = loaders['spokeo']
                                spokeo_loader['color'] = this.state.green
                                if(response5.status === 202) {
                                    len = response5.data.cleanResponses.length - response4.data.cleanResponses.length
                                    if (len === 1) {
                                        spokeo_loader['text'] = len + " record found"
                                    } else {
                                        spokeo_loader['text'] = len + " records found"
                                    }
                                
                                    // append results to surfaceweb response and attributes list bs
                                    this.setState({
                                        surfaceWebResults: response5.data.return,
                                        surfaceWebResponse_clean: response5.data.cleanResponses,
                                        surfaceWebAttributesLists: response5.data.surfaceWebAttributesLists,
                                        searchEngines: loaders,
                                        showLoader: true,
                                        showLoaders: false,
                                        loaderMessage: "Resolving Your Identity",
                                    })
                                } else {
                                    spokeo_loader['text'] = "0 records found"
                                    this.setState({
                                        surfaceWebResults: response5.data.return,
                                        surfaceWebResponse_clean: response5.data.cleanResponses,
                                        surfaceWebAttributesLists: response5.data.surfaceWebAttributesLists,
                                        searchEngines: loaders
                                    })
                                }


                EmailDataService.resolve(this.state.uneditedDbResponse, response5.data.return)
                .then(finalResponse => {
                    console.log("db response: ")
                    console.log(this.state.uneditedDbResponse)
                    var entities = []
                    var sources = []
                    var dates = []
                    var exposedAttributesList = []
                    var exposedAttributesVals = []
                    var predictions = finalResponse.data.predictions
                    var tfidf_predictions = finalResponse.data.tfidf_predictions
                    //alert("we have your name and zip in database")
                    if(finalResponse.status === 202) {
                        for(var i = 0; i < finalResponse.data.entities.length; i++) {
                            entities.push(finalResponse.data.entities[i])
                            sources.push(finalResponse.data.sources[i])
                            dates.push(finalResponse.data.dates[i])
                            exposedAttributesList.push(finalResponse.data.exposedAttributesList[i])
                            exposedAttributesVals.push(finalResponse.data.exposedAttributesVals[i])
                        }

                        this.organizePredictionTable(predictions, tfidf_predictions);

                        this.setState({
                            dbComplete: false,
                            showSurfaceWebResponse: false,
                            showLoader: false,
                            showSearchAgain: true,
                            predictions: predictions,
                            tfidf_predictions: tfidf_predictions,
                        })
                        this.callDisplay(entities[0],sources[0],dates[0],exposedAttributesList[0],exposedAttributesVals[0])
                        return true;
                    } else if(finalResponse.status === 204) {
                        this.setState({
                            showLoader: false,
                            showGoodNews: true,
                            showSearchAgain: true,
                            searchAgainClass: "col-5"
                        })
                        return false
                    }
                }).catch(e => {
                    console.log("error on resolve api call")
                    console.log(e);
                    this.setState({
                        showLoader: false,
                        showSurfaceWebResponse: false,
                        showGoodNews: true,
                        showSearchAgain: true,
                        searchAgainClass: "col-5"
                    })
                });



                // return true;
            }).catch(e => {
                console.log("error on spokeo api call")
                console.log(e);
                this.setState({
                    showLoader: false,
                    showSurfaceWebResponse: false,
                    showGoodNews: true,
                    showSearchAgain: true,
                    searchAgainClass: "col-5"
                })
            })

            }).catch(e => {
                console.log("error on peekyou api call")
                console.log(e);
                this.setState({
                    showLoader: false,
                    showSurfaceWebResponse: false,
                    showGoodNews: true,
                    showSearchAgain: true,
                    searchAgainClass: "col-5"
                })
            })

            }).catch(e => {
                console.log("error on mylife api call")
                console.log(e);
                this.setState({
                    showLoader: false,
                    showSurfaceWebResponse: false,
                    showGoodNews: true,
                    showSearchAgain: true,
                    searchAgainClass: "col-5"
                })
            })

            }).catch(e => {
                console.log("error on zabasearch api call")
                console.log(e);
                this.setState({
                    showLoader: false,
                    showSurfaceWebResponse: false,
                    showGoodNews: true,
                    showSearchAgain: true,
                    searchAgainClass: "col-5"
                })
            })

            } else if(response.status === 204) {
                this.setState({
                    showLoader: false,
                    showGoodNews: true,
                    showSearchAgain: true,
                    searchAgainClass: "col-5"
                })
                return false
            }


        }).catch(e => {
            console.log("error on anywho api call")
            console.log(e);
            this.setState({
                showLoader: false,
                showSurfaceWebResponse: false,
                showGoodNews: true,
                showSearchAgain: true,
                searchAgainClass: "col-5"
            })
        });
        
    }

    setSelection(event) {
        console.log(event.target.value);
        this.setState({
            selectedValue: event.target.value
        });
    }

    callDisplay(entity, sources, datesCollected, exposedAttributes, exposedAttributesVals) {
        var dbresponse = this.state.dbResponse
        var scoreAlertVariant, privacyRisk, amountBreached;
        var breaches = []

        try {
            breaches.push(this.state.dbResponse.platform)
            amountBreached = breaches.length
        } catch {
            breaches.push('unknown')
            amountBreached = breaches.length
            dbresponse['platform'] = "unknown"
        }
        
        if(entity.score<1.6) {
            scoreAlertVariant = "success";
            privacyRisk = "low"
        } else if(entity.score>8.4) {
            scoreAlertVariant = "danger";
            privacyRisk = "high"
        } else {
            scoreAlertVariant = "warning";
            privacyRisk = "medium"
        }

        if(this.state.searchState === 'Name + Zip') {
            this.setState({
                showScore: true,
                entity: entity,
                source: sources,
                dates: datesCollected,
                entityInd: 0,
                showProtectYourself: true,
                exposedAttributes: exposedAttributes,
                exposedAttributesVals: exposedAttributesVals,
                scoreAlertVariant: scoreAlertVariant,
                privacyRisk: privacyRisk,
                breaches: breaches,
                amountBreached: amountBreached,
                dbResponse: dbresponse,
            })
        } else if(this.state.searchState === 'Email')
        {
            this.setState({
                showScoreEmail: true,
                entity: entity,
                source: sources,
                dates: datesCollected,
                entityInd: 0,
                showProtectYourself: true,
                exposedAttributes: exposedAttributes,
                exposedAttributesVals: exposedAttributesVals,
                scoreAlertVariant: scoreAlertVariant,
                privacyRisk: privacyRisk,
                breaches: breaches,
                amountBreached: amountBreached,
                dbResponse: dbresponse,
            })
        }
    }

    validateEmail(email) {
        console.log("in validate email")
        var re = /\S+@\S+\.\S+/;
        return re.test(String(email).toLowerCase());
    }

    displayGoodNews(event) {
        this.setState({
            showDbResponse: false,
            showGoodNews: true,
            showSearchAgain: true,
        })
        event.preventDefault();
    }

    showPredictions(event) {
        console.log("predictions")
        console.log(this.state.predictions)
        console.log("surfacewebresults")
        console.log(this.state.surfaceWebResults)
        this.setState({
            showPredictionResults: true,
            showScore: false,
            showProtectYourself: false
        })
        event.preventDefault();
    }

    goBack(event){
        this.setState({
            showPredictionResults: false,
            showScore:true, 
            showProtectYourself: true
        })
        event.preventDefault();
    }

    organizePredictionTable(predictions, tfidf_predictions) {
        //gotta create an array of dictionary objects that I can use to populate the predictions results table
        //doesnt necessarily need to be sorted
        //just need two lists, one for matches and one for nonmatches
        var matches = []
        var nonmatches = []
        predictions.map((value, index) => {
            var res = {}
            res['value'] = value;
            res['tfidf_value'] = tfidf_predictions[index]
            res['surfaceWebResults'] = this.state.surfaceWebResults[index]
            res['surfaceWebAttributesLists'] = this.state.surfaceWebAttributesLists[index]
            res['attributes'] = this.state.surfaceWebResponse_clean[index].attributes

            console.log("res")
            console.log(res)

            if(value > 0.5){ 
                matches.push(res)
            } else {
                nonmatches.push(res)
            }
        })

        var dbresponse_organized = {}

        this.setState({
            predictionMatches: matches,
            predictionnonMatches: nonmatches,
            dbresponse_organized: dbresponse_organized
        })

    }

    handleChange(field, event) {
        if(field === 'Email') {
            this.setState({searchValue: event.target.value});
        }else if(field === 'Name'){ 
            this.setState({nameValue: event.target.value});
        }
        else if(field === 'Zip') {
            this.setState({zipValue: event.target.value});
        }
        else if(field === 'birthyearInput') {
            this.setState({birthyearInput: event.target.value});
        }
    }

    handleAgeCheck(event) {
        var newDBResponse = [];
        var newUneditedDbResponse = [];
        var newCleanResponses = [];
        for(var i = 0; i < this.state.dbResponse.length; i++) {
            var curr = this.state.dbResponse[i]
            if (curr["birthyear"] === this.state.birthyearInput) {
                newDBResponse.push(curr)
                newUneditedDbResponse.push(this.state.uneditedDbResponse[i])
                newCleanResponses.push(this.state.cleanResponses[i])
            }
        }
        if(newDBResponse.length > 0) {
            this.setState({
                showDbResponse: true,
                dbAmount: newDBResponse.length,
                dbResponse: newDBResponse,
                uneditedDbResponse: newUneditedDbResponse,
                cleanResponses: newCleanResponses,
                showSearchAgain: true,
                showAgeCheck: false
            })
        }else {
            console.log("that aint it")
        }
        
        event.preventDefault();

    }

    render() {
        return [
            //searching functionality
                <div style={{backgroundColor:"#222A35", paddingBottom:"40px", paddingTop:"40px", marginTop:"-30px"}}>
                {this.state.showSearch && 
                    <Searchbar 
                        handleSubmit={this.handleSubmit} searchValue={this.state.searchValue} 
                        zipValue={this.state.zipValue} nameValue={this.state.nameValue} 
                        fieldName={this.state.fieldName} >
                    </Searchbar>}
                </div>,

            //birthyear check
            <div className="container d-flex justify-content-center">
                {this.state.showAgeCheck &&
                    <Alert className="" style={{paddingBottom: "2rem", paddingRight: "3rem", paddingLeft: "3rem", backgroundColor: "#609cd4", borderRadius: "2rem"}}>
                        <div className="row" style={{textAlign:"center", marginBottom:"1rem"}}>
                        <h1>Please enter your <b>birth year</b> to verify your identity:</h1>
                        </div>
                        <div className="row justify-content-center" style={{}}>
                            <input style={{height:'100%',  fontSize: 'xx-large', width:'20%', marginBottom: ".1rem"}} 
                            id="agecheck" className="form-control" type="search" aria-label="Search" 
                            value={this.state.birthyearInput || ''} onChange={(e) => this.handleChange('birthyearInput', e)} />
                        </div> 
                        <div className="row justify-content-center" style={{}}>
                            <button 
                                style={{backgroundColor: '#203864', color:'#B9BDC5', borderColor:'#656565', width: '20%', height:'60%', fontSize: 'x-large'}} 
                                className="btn" onClick={(e) => this.handleAgeCheck(e)}>
                                Submit
                            </button>
                        </div> 
                    </Alert>
                }
            </div>,   

            //error message
                <div className="container d-flex justify-content-center">
                    {this.state.errorMessage.length === 0 ? 
                    <div style={{marginTop:'82px'}}></div>
                    : 
                    <Alert variant="danger">
                        <p>{this.state.errorMessage}</p>
                    </Alert>
                    }
                </div>,   

            

            //show db Response
                <>
                <div className="row justify-content-center">
                <div className="col-lg-6">
                {this.state.showDbResponse && 
                    // <DatabaseResponse 
                    //     dbResponse={this.state.dbResponse} es={this.state.es} 
                    //     chooseDbResponse={this.chooseDbResponse} displayGoodNews={this.displayGoodNews}>
                    // </DatabaseResponse>
                    <div>
                        <h1 className="text-center">We found {this.state.dbResponse.length} result{this.state.es} in our breached records:</h1>
                        <div className="row">
                        {this.state.dbResponse.map((value, index) => {
                            return <div className="col-4" style={{paddingBottom: "10px"}}>
                                <div className="card" onClick={(e) => this.chooseDbResponse(index, e)}
                                    style= {{paddingBottom: "2rem", paddingRight: "1rem", paddingLeft: "1rem", borderRadius: "2rem",
                                            backgroundColor:"#609cd4", cursor: 'pointer', height:'100%', width: '100%'}}
                                >
                                    <div style={{marginBottom: "1rem"}} className="row justify-content-center">
                                        <img src='cardProfileImage.png' style={{height:'50px', width: '50px'}} alt={"card profile#" + index }></img>
                                    </div>
                                    <table style={{border: "3px solid black"}}>
                                        <tbody>
                                        <tr style={{border: "3px solid black", backgroundColor: "#283c64"}}>
                                            <th style={{border: "3px solid black", width:"50%"}}>&nbsp;&nbsp;Name</th>
                                            <th style={{border: "3px solid black", width:"50%"}}>&nbsp;&nbsp;{value.name}</th>
                                        </tr>
                                        <tr style={{border: "3px solid black"}}>
                                            <td style={{border: "3px solid black"}}>&nbsp;&nbsp;Phone Number</td>
                                            <td style={{border: "3px solid black"}}>&nbsp;&nbsp;{value.phoneNumber}</td>
                                        </tr>
                                        <tr style={{border: "3px solid black"}}>
                                            <td style={{border: "3px solid black"}}>&nbsp;&nbsp;Birth Year</td>
                                            <td style={{border: "3px solid black"}}>&nbsp;&nbsp;{value.birthyear}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        })}
                        </div>
                        <div className="row justify-content-center">
                        <div className="col-6">
                            <Alert style={{backgroundColor:'#609cd4', color:'white', cursor:'pointer', textAlign: 'center', fontSize: "1.5rem"}} onClick={(e) => this.displayGoodNews(e)}>
                                None of these records are mine.
                            </Alert>
                        </div>
                        </div>
                    </div>
                }
                </div>
                </div>
                </>,

            //show score
                <div className="container">
                    {this.state.showScore && 
                    <div className="row justify-content-center text-center">
                    <div className="col-lg-12">
                     <Alert variant={this.state.scoreAlertVariant}>
                         <h4 style={{fontSize: "xx-large"}}>Your information has been <b>compromised</b> in {this.state.amountBreached} breach{this.state.amountBreached === 1 ? null : <>es</>}:</h4>
                         <h4 style={{fontSize: "xx-large"}}>
                         {this.state.breaches.map((value, index) => {
                             return <p>{value}</p>
                         })}
                         </h4>
                         <div className="row justify-content-center text-center">
                             <div className="col-lg-8">
                                 <Alert style={{backgroundColor:'#7C7C7C', color:'white', cursor: 'pointer', fontSize:"x-large"}} onClick={(e) => this.showPredictions(e)}>
                                     What was compromised? {this.state.exposedAttributes}
                                 </Alert>
                             </div>
                         </div>
                         <div className="row justify-content-center text-center">
                         <div className="col-lg-6">
                             <GaugeChart 
                                 id="gauge-chart2" 
                                 nrOfLevels={3} 
                                 percent={this.state.entity.score / 10}
                                 // percent={.49}
                                 textColor={"#000000"} 
                                 arcsLength={[0.159, 0.682, 0.159]}
                                 style={{width:'100%'}}
                                 arcPadding={0}
                                 cornerRadius={2}
                             />
                         </div>
                         </div>
                         <h4 style={{fontSize: "xx-large"}}>Your privacy is at <b>{this.state.privacyRisk}</b> risk compared to others in your age group.</h4>
                         <h4 style={{fontSize: "xx-large"}}>Your privacy risk score is <b>{this.state.entity.score}</b></h4>
                         <p style={{fontSize: "large"}}>Find out what this score means&nbsp;<u style={{color: "inherit", cursor: 'pointer'}} onClick={(e) => this.showPredictions(e)}>here.</u></p>
                         </Alert>
                     </div>
                     
                 </div>
                 }
                </div>,

            //show score email
                <div className="container">
                    {this.state.showScoreEmail && 
                    <div className="row justify-content-center text-center">
                    <div className="col-lg-12">
                     <Alert variant={this.state.scoreAlertVariant}>
                         <h4 style={{fontSize: "xx-large"}}>Your information has been <b>compromised</b> in {this.state.amountBreached} breach{this.state.amountBreached === 1 ? null : <>es</>}:</h4>
                         <h4 style={{fontSize: "xx-large"}}>
                         {this.state.breaches.map((value, index) => {
                             return <p>{value}</p>
                         })}
                         </h4>
                         <div className="row justify-content-center text-center">
                             <div className="col-lg-8">
                                 <Alert style={{backgroundColor:'#7C7C7C', color:'white', fontSize:"x-large"}}>
                                     What was compromised? {this.state.exposedAttributes}
                                 </Alert>
                             </div>
                         </div>
                         <div className="row justify-content-center text-center">
                         <div className="col-lg-6">
                             <GaugeChart 
                                 id="gauge-chart2" 
                                 nrOfLevels={3} 
                                 percent={this.state.entity.score / 10}
                                 // percent={.49}
                                 textColor={"#000000"} 
                                 arcsLength={[0.159, 0.682, 0.159]}
                                 style={{width:'100%'}}
                                 arcPadding={0}
                                 cornerRadius={2}
                             />
                         </div>
                         </div>
                         <h4 style={{fontSize: "xx-large"}}>Your privacy is at <b>{this.state.privacyRisk}</b> risk compared to others in your age group.</h4>
                         <h4 style={{fontSize: "xx-large"}}>Your privacy risk score is <b>{this.state.entity.score}</b></h4>
                         <p style={{fontSize: "large"}}>Find out what this score means&nbsp;<a style={{color: "inherit", cursor: 'pointer'}} href="/about"><u>here.</u></a></p>
                         </Alert>
                     </div>
                     
                 </div>
                 }
                </div>,

            //show prediction results
            <div className="container">
                
                {this.state.showPredictionResults && 
                
                <div className="row justify-content-center text-center">
                    <div className="col-lg-12">

                        <div className="row"><h2>Result from our database:</h2></div>
                        <div className="row">
                            <Alert style={{backgroundColor: "#7C7C7C"}}>
                                <DatabaseTable dbresponse={this.state.cleanResponse}></DatabaseTable>
                            </Alert>
                        </div>
                        <div className="row"><h2>Results from surface web search engines:</h2></div>
                        <div className="row">
                            <Alert style={{backgroundColor: "#7C7C7C"}}>
                                <ResultsTable matches={this.state.predictionMatches} nonmatches={this.state.predictionnonMatches}>    
                                </ResultsTable>
                            </Alert>
                        </div>
                        <IoMdArrowRoundBack style={{cursor:'pointer'}} size='5em' onClick={(e) => this.goBack(e)}></IoMdArrowRoundBack>

                    </div>
                </div>
                }
            </div>,

            //db searching breached records complete
                <div className="container">
                {this.state.dbComplete && 
                    <div>
                    <h2 className="text-center">Searching breached records <img src="successfulSearch.png" alt="succesful database response"></img></h2>
                    </div>
                }
                </div>,


            //show 5 surface web searching loaders 
                <div className="container d-flex justify-content-center">
                    <div className="col-lg-10">
                    <div className="row justify-content-center">
                    {this.state.showLoaders && 
                        <> 
                            {Object.entries(this.state.searchEngines).map( ([key, value]) => {
                                return <div className="">
                                <div className="row" style={{paddingBottom: "10px", paddingLeft: "1rem", paddingRight:'1rem', alignItems:'center'}}>
                                    <div className="card"
                                        style= {{paddingBottom: "2rem", paddingRight: "1rem", paddingLeft: "1rem", borderRadius: "1rem", borderColor: 'white',
                                                backgroundColor:value.color, height:'5rem', width: '7.5rem', textAlign:'center', alignItems:'center', lineHeight:'5rem'}}
                                    >
                                        <p><b>{key}</b></p>
                                    </div>
                                    {value.hasArrow && <GoArrowRight size={'2em'}></GoArrowRight>}
                                </div>
                                &nbsp;{value.text}
                                </div>
                            })}
                        </>
                    }
                        </div>
                    </div>
                </div>,

            //show one loader with customizable message
                <div className="row justify-content-center">
                    {this.state.showLoader && 
                        <div> 
                            <div className="row">
                            <h2><ReactLoading type={this.state.loaderType} color={"white"} height={'10%'} width={'10%'} />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.loaderMessage}</h2>
                            </div>
                        </div>
                    }
                </div>,

            //show breach stats
                <div style={{fontSize: 'xx-large', fontWeight: 'bold'}}>
                    {this.state.showBreachTotals && 
                    <>
                    <div className='row justify-content-center'>
                        <div className="col-lg-2">
                            <div className="row justify-content-center"> 
                                {this.state.numEmails}
                            </div>
                            <div className="row justify-content-center"> 
                                emails
                            </div>
                        </div> 
                        <div className="col-lg-2">
                            <div className="row justify-content-center"> 
                                {this.state.numNames}
                            </div>
                            <div className="row justify-content-center"> 
                                names
                            </div>
                        </div> 
                    </div>
                    </>
                    }
                </div>,

            //show bad news, email breached but no surface web response
                <div>
                    {this.state.showBadNews && 
                    <BadNewsEmail breaches={this.state.breaches}></BadNewsEmail>
                    }

                </div>,

            //show good news, no breached data
                <div className="container d-flex justify-content-center">
                    {this.state.showGoodNews && 
                    <h1>No compromised data found!</h1>
                    }
                </div>,

            //show protect yourself
                <div style={{fontSize: 'xx-large', fontWeight: 'bold'}}>
                {this.state.showProtectYourself && 
                <>
                <div className='row justify-content-center'>
                    How do I protect myself? Find out&nbsp;<a style={{color: "inherit"}}href="/ProtectYourself"><u>here</u></a>.
                </div>
                </>
                }
            </div>,
                    

        ]
    }
}

export default Homepage;
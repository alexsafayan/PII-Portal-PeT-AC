import React from 'react';
import GaugeChart from 'react-gauge-chart';
import { GoArrowRight } from "react-icons/go";
import Alert from 'react-bootstrap/Alert';
import ReactLoading from 'react-loading';
import '../home.css';
import Boxplot from '../Components/Boxplot.js'
import '../App.css'
import { DarkWebTable, SurfaceWebTable } from '../Components/DisplayResults.js';
import EmailDataService from "../services/email.service";
import Searchbar from "../Components/Searchbar";



class Homepage extends React.Component {

    

    constructor(props) {
        super(props);
        this.state = {
            db_attributes: ['name', 'zip', 'address', 'jobDetails'],
            num_pse: 1,
            showMCA: false,
          sample_cleanRecords: {
                'address': "1234 Ma**********",
                'age': 73,
                'attributes': "name: lee katchen | zip: 16*** | address: 1234 Ma********** | jobDetails: carpenter | relationshipStatus: married | politicalViews: moderate | religiousViews: buddhist | birthyear: 1948 | phoneNumber: 631-***-**** | city: er****** ",
                'birthyear': "1948",
                'city': "er******",
                'dateCollected': "2018-07-07 17:56:15",
                'jobDetails': "carpenter",
                'name': "lee katchen",
                'phoneNum': 1,
                'phoneNumber': "631-***-****",
                'platform': "TorMarket",
                'politicalViews': "moderate",
                'relationshipStatus': "married",
                'religiousViews': "buddhist",
                'zip': "16***"
            },
          privacyAttributesDict: {"phoneNumber": "Phone Number", "email": "Email", "address": "Address", "birthdate": "Birthdate", 
          "hometown": "Hometown", "currentTown": "Current Town", "jobDetails": "Job Details", "relationshipStatus": "Relationship Status", 
          "interests": "Interests", "religiousViews": "Religious Views", "politicalViews": "Political Views", 'name':'Name','phoneNum':'Phone Number', 
          'birthday':'Birthdate', 'gender':'Gender'},
          surfaceWebResults: [],
          db_breach: {'tormarket': ['December 2016', '100,000']},
          email_breach: {'Collection #1': ['January 2019', '772,904,991']},
          surfaceWebResponse_clean: [],
          surfaceWebAttributesLists: [],
          numBreaches: "",
          numEmails: "2,730,903,926",
          numNames: "11,068,457",
          showBreachTotals: true,
          showProtectYourself: false,
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
          score: 1.6,
          amountBreached: 0,
          breaches: [],
          fieldName: 'Name + Zip',
          loaderType: 'spokes',
          mcaDescription: "AI powered entity matching model.",
          red: "#ff9c9c",
          green: "#78ac44",
          initial_searchEngines: {
            'anywho': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name'], 'removeDataURL': 'https://www.intelius.com/opt-out/submit/'}, 
            'zabasearch': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name'], 'removeDataURL': 'https://www.intelius.com/opt-out/submit/'}, 
            'mylife': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name'], 'removeDataURL': 'https://www.mylife.com/ccpa/index.pubview'}, 
            'peekyou': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name'], 'removeDataURL': 'https://www.peekyou.com/about/contact/ccpa_optout/right_to_know_and_delete/'}, 
            'spokeo': {'color': "#ff9c9c", 'text': '', 'hasArrow': false, 'platform_attributes': ['name'], 'removeDataURL': 'https://www.spokeo.com/optout'}
        },
        //   searchEngines: {
        //     'anywho': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name']}, 
        //     'zabasearch': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name']}, 
        //     'mylife': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name']}, 
        //     'peekyou': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name']}, 
        //     'spokeo': {'color': "#ff9c9c", 'text': '', 'hasArrow': false, 'platform_attributes': ['name']}
        //     },
            searchEngines: {
                'anywho': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name', 'birthday', 'email','phoneNum'], 'results': [
                {
                'surfaceWebResults': {
                'address': "None",
                'birthday': "01/04/1968",
                'currentTown': "None",
                'email': ['****@gmail.com', '****@neo.rr.com', '****@neo.rr.com', '****@gmail.com'],
                'gender': "Female",
                'hometown': "none",
                'name': "Lee Katchen",
                'phoneNum': ['814-***-****', '814-***-****'],
                'platform': "Anywho",
                'politicalViews': "none",
                'relationshipStatus': "none",
                'religiousViews': "None",
                'state': "None"},
                'match':'yes'
                },
                {
                    'surfaceWebResults': {
                    'address': "None",
                    'birthday': "01/04/1968",
                    'currentTown': "None",
                    'email': ['****@gmail.com', '****@neo.rr.com', '****@neo.rr.com', '****@gmail.com'],
                    'gender': "Female",
                    'hometown': "none",
                    'name': "Lee Katchen",
                    'phoneNum': ['814-***-****', '814-***-****'],
                    'platform': "Anywho",
                    'politicalViews': "none",
                    'relationshipStatus': "none",
                    'religiousViews': "None",
                    'state': "None"},
                    'match':'no'
                    },
                    ]
                    , 'removeDataURL': 'https://www.intelius.com/opt-out/submit/'}, 
                'zabasearch': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name', 'birthday', 'phoneNum'], 'results': [{
                    'surfaceWebResults': {
                    'address': "None",
                    'birthday': "01/04/1968",
                    'currentTown': "None",
                    'email': ['****@gmail.com', '****@neo.rr.com', '****@neo.rr.com', '****@gmail.com'],
                    'gender': "Female",
                    'hometown': "none",
                    'name': "Lee Katchen",
                    'phoneNum': ['814-***-****', '814-***-****'],
                    'platform': "Zabasearch",
                    'politicalViews': "none",
                    'relationshipStatus': "none",
                    'religiousViews': "None",
                    'state': "None"},
                    'match':'yes'
                    },], 'removeDataURL': 'https://www.intelius.com/opt-out/submit/'}, 
                'mylife': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name'], 'results': [], 'removeDataURL': 'https://www.mylife.com/ccpa/index.pubview'}, 
                'peekyou': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name', 'religiousViews', 'politicalViews','phoneNum'], 'results': [], 'removeDataURL': 'https://www.peekyou.com/about/contact/ccpa_optout/right_to_know_and_delete/'}, 
                'spokeo': {'color': "#ff9c9c", 'text': '', 'hasArrow': false, 'platform_attributes': ['name'], 'results': [], 'removeDataURL': 'https://www.spokeo.com/optout'}
                }
          
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.displayGoodNews = this.displayGoodNews.bind(this);
        this.showER = this.showER.bind(this);
        this.showMCA = this.showMCA.bind(this);
        this.showScoreCalculation = this.showScoreCalculation.bind(this);
        this.showRemovalProcess = this.showRemovalProcess.bind(this);
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
        var initial_searchEngines = {
            'anywho': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name'], 'removeDataURL': 'https://www.intelius.com/opt-out/submit/'}, 
            'zabasearch': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name'], 'removeDataURL': 'https://www.intelius.com/opt-out/submit/'}, 
            'mylife': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name'], 'removeDataURL': 'https://www.mylife.com/ccpa/index.pubview'}, 
            'peekyou': {'color': "#ff9c9c", 'text': '', 'hasArrow': true, 'platform_attributes': ['name'], 'removeDataURL': 'https://www.peekyou.com/about/contact/ccpa_optout/right_to_know_and_delete/'}, 
            'spokeo': {'color': "#ff9c9c", 'text': '', 'hasArrow': false, 'platform_attributes': ['name'], 'removeDataURL': 'https://www.spokeo.com/optout'}}
        this.setState({
            errorMessage: "",
            line1: "",
            score: 0,
            showGoodNews: false,
            showER: false,
            showEmail: false,
            searchState: fieldName,
            fieldName: fieldName,
            searchValue: searchValue,
            nameValue: nameValue,
            zipValue: zipValue,
            searchEngines: initial_searchEngines,
            showProfile: false,
            showEmailProfile: false,
            showERResults: false,
            showRemovalProcess: false,
            showRemovalProcess: false,
            surfaceWebResults: [],
            surfaceWebResponse_clean: [],
            surfaceWebAttributesLists: [],
            showLoader: false,
            dbAmount: 0,
            dbResponse: {},
            uneditedDbResponse: {},
            cleanResponses: {},
            es: '',
            showDbResponse: false,
            db_attributes: {},
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
                EmailDataService.queryEmail(searchValue)
                .then(response => {
                    if(response.status === 202) {
                        console.log("response:")
                        console.log(response)
                        this.setState({
                            dbComplete: true,
                            loaderMessage: "Searching surface web",
                            dbResponse: response.data.dbResponse,
                            
                        })
                        EmailDataService.crawlPSEEmail(searchValue, response.data.dbResponse)
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
                                    showEmailProfile: true,
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
                EmailDataService.queryName(nameValue, zipValue)
                .then(response => {
                    console.log("db search response.data:");
                    console.log(response.data);
                    if(response.status === 202) {
                        var dbResponse = response.data.dbResponse;
                        var es = ""
                        if(dbResponse.length !== 1) {
                            es = "s"
                        }
                        this.setState({
                            showLoader: false,
                            dbAmount: dbResponse.length,
                            dbResponse: dbResponse,
                            uneditedDbResponse: response.data.uneditedResponses,
                            cleanResponses: response.data.cleanResponses,
                            es: es,
                            showDbResponse: true,
                            db_attributes: response.data.db_attributes,
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
        console.log('search engines:')
        console.log(this.state.searchEngines)
        var dbResponse = this.state.dbResponse[id]
        var uneditedDbResponse = this.state.uneditedDbResponse[id]
        var cleanResponse = this.state.cleanResponses[id]
        this.setState({
            uneditedDbResponse: uneditedDbResponse,
            showDbResponse: false,
            showLoaders: true,
            showSearchAgain: false,
            dbResponse: dbResponse,
            cleanResponse: cleanResponse,
        })
        EmailDataService.crawlPSE(this.state.nameValue, this.state.zipValue, "anywho", this.state.surfaceWebResults, this.state.surfaceWebResponse_clean, this.state.surfaceWebAttributesLists)
        .then(response => {
            var num_pse = 0
            console.log("response1: ")
            console.log(response)
            if(response.status === 202) {
                // update loaders:
                var loaders = this.state.searchEngines;
                var anywho_loader = loaders['anywho']
                anywho_loader['color'] = this.state.green
                anywho_loader['platform_attributes'] = anywho_loader['platform_attributes'].concat(response.data.platform_attributes);
                var len = response.data.cleanResponses.length
                console.log('anywho response: ')
                console.log(response.data.cleanResponses)
                if (len > 1) num_pse+=1
                if (len === 1) {
                    anywho_loader['text'] = len + " record found"
                } else {
                    anywho_loader['text'] = len + " records found"
                }
                
                console.log(' anywho loader is '+loaders['anywho'])

                
                // var surfaceWebResponse = response.data.return
                this.setState({
                    showSurfaceWebResponse: false,
                    surfaceWebResults: response.data.return,
                    surfaceWebResponse_clean: response.data.cleanResponses,
                    surfaceWebAttributesLists: response.data.surfaceWebAttributesLists,
                    searchEngines: loaders,
                    showPSETable: true,
                    // showLoader: true,
                    // showLoaders: false,
                    // loaderMessage: "Resolving Your Identity",
                })
                EmailDataService.crawlPSE(this.state.nameValue, this.state.zipValue, "zabasearch", response.data.return, response.data.cleanResponses, response.data.surfaceWebAttributesLists)
                .then(response2 => {
                    console.log("response2: ")
                    console.log(response2)
                    // var loaders = this.state.searchEngines;
                    var zabasearch_loader = loaders['zabasearch']
                    zabasearch_loader['color'] = this.state.green
                    zabasearch_loader['platform_attributes'] = zabasearch_loader['platform_attributes'].concat(response2.data.platform_attributes);
                    if(response2.status === 202) {
                        len = response2.data.cleanResponses.length - response.data.cleanResponses.length
                        if (len > 1) num_pse+=1
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
                    // console.log('sending as parameters for mylife: ')
                    // console.log(response2.data.return.length)
                    // console.log(response2.data.cleanResponses.length)
                    // console.log(response2.data.surfaceWebAttributesLists.length)
                    EmailDataService.crawlPSE(this.state.nameValue, this.state.zipValue, "mylife", response2.data.return, response2.data.cleanResponses, response2.data.surfaceWebAttributesLists)
                    .then(response3 => {
                        console.log("response3: ")
                        console.log(response3)
                        var mylife_loader = loaders['mylife']
                        mylife_loader['color'] = this.state.green
                        mylife_loader['platform_attributes'] = mylife_loader['platform_attributes'].concat(response3.data.platform_attributes);
                        if(response3.status === 202) {
                            len = response3.data.cleanResponses.length - response2.data.cleanResponses.length
                            if (len > 1) num_pse+=1
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
                        // console.log('sending as parameters for peekyou: ')
                        // console.log(response3.data.return.length)
                        // console.log(response3.data.cleanResponses.length)
                        // console.log(response3.data.surfaceWebAttributesLists.length)
                        EmailDataService.crawlPSE(this.state.nameValue, this.state.zipValue, "peekyou", response3.data.return, response3.data.cleanResponses, response3.data.surfaceWebAttributesLists)
                        .then(response4 => {
                            console.log("response4: ")
                            console.log(response4)
                            var peekyou_loader = loaders['peekyou']
                            peekyou_loader['color'] = this.state.green
                            peekyou_loader['platform_attributes'] = peekyou_loader['platform_attributes'].concat(response4.data.platform_attributes);
                            if(response4.status === 202) {
                                len = response4.data.cleanResponses.length - response3.data.cleanResponses.length
                                if (len > 1) num_pse+=1

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
                            // console.log('sending as parameters for spokeo: ')
                            // console.log(response4.data.return.length)
                            // console.log(response4.data.cleanResponses.length)
                            // console.log(response4.data.surfaceWebAttributesLists.length)
                            EmailDataService.crawlPSE(this.state.nameValue, this.state.zipValue, "spokeo", response4.data.return, response4.data.cleanResponses, response4.data.surfaceWebAttributesLists)
                            .then(response5 => {
                                console.log("response5: ")
                                console.log(response5)
                                var spokeo_loader = loaders['spokeo']
                                spokeo_loader['color'] = this.state.green
                                spokeo_loader['platform_attributes'] = spokeo_loader['platform_attributes'].concat(response5.data.platform_attributes);
                                if(response5.status === 202) {
                                    len = response5.data.cleanResponses.length - response4.data.cleanResponses.length
                                    if (len > 1) num_pse+=1
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
                                        showPSETable: false,
                                        num_pse: num_pse,
                                    })
                                } else {
                                    spokeo_loader['text'] = "0 records found"
                                    this.setState({
                                        surfaceWebResults: response5.data.return,
                                        surfaceWebResponse_clean: response5.data.cleanResponses,
                                        surfaceWebAttributesLists: response5.data.surfaceWebAttributesLists,
                                        searchEngines: loaders,
                                        showPSETable: false
                                    })
                                }


                EmailDataService.resolve(this.state.uneditedDbResponse, response5.data.return)
                .then(finalResponse => {
                    console.log("finalResponse: ")
                    console.log(finalResponse)
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
                showProfile: true,
                // showERResults: true,
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
                showEmailProfile: true,
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

    showER(event) {
        console.log("in show ER")
        // console.log(this.state.predictions)
        // console.log("surfacewebresults")
        // console.log(this.state.surfaceWebResults)
        // console.log('clean response:')
        // console.log(this.state.cleanResponse)
        this.setState({
            showERResults: true,
            showProtectYourself: false,
            showProfile: false
        })
        event.preventDefault();
    }

    showMCA(event) {
        console.log("in show MCA")
        this.setState({

            showERResults: !this.state.showERResults,
            showMCA: !this.state.showMCA
        })
        event.preventDefault();
    }

    showScoreCalculation(event) {
        console.log("in show score calculation")
        this.setState({
            showScoreCalculation: true,
            showProtectYourself: false,
            showProfile: false
        })
        event.preventDefault();
    }

    showRemovalProcess(event) {
        console.log("in show removal process")
        this.setState({
            showRemovalProcess: true,
            showProtectYourself: false,
            showProfile: false
        })
        event.preventDefault();
    }

    goBack(event){
        console.log('current state:')
        console.log(this.state)
        if(this.state.searchState === 'Name + Zip') {
            this.setState({
                showERResults: false,
                showScoreCalculation: false,
                showRemovalProcess: false,
                showProfile:true, 
                showProtectYourself: true
            })
        } else if(this.state.searchState === 'Email')
        {
            this.setState({
                showERResults: false,
                showScoreCalculation: false,
                showRemovalProcess: false,
                showEmailProfile:true, 
                showProtectYourself: true
            })
        }
        this.setState({
            showERResults: false,
            showScoreCalculation: false,
            showRemovalProcess: false,
            showProfile:true, 
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
        var anywho_records = []
        var zabasearch_records = []
        var mylife_records = []
        var peekyou_records = []
        var spokeo_records = []
        predictions.map((value, index) => {
            var res = {}
            res['value'] = value;
            res['tfidf_value'] = tfidf_predictions[index]
            res['surfaceWebResults'] = this.state.surfaceWebResults[index]
            res['surfaceWebAttributesLists'] = this.state.surfaceWebAttributesLists[index]
            res['attributes'] = this.state.surfaceWebResponse_clean[index].attributes

            // console.log("res")
            // console.log(res)

            if(value > 0.5){ 
                matches.push(res)
            } else {
                nonmatches.push(res)
            }
        })

        matches.map((value, index) => {
            value['match'] = 'yes'
            if(value.surfaceWebResults.platform === "Anywho" ){ 
                anywho_records.push(value)
            } else if (value.surfaceWebResults.platform==="Zabasearch" ){
                zabasearch_records.push(value)
            }else if (value.surfaceWebResults.platform==="Mylife" ){
                mylife_records.push(value)
            }else if (value.surfaceWebResults.platform==="Peekyou" ){
                peekyou_records.push(value)
            }else if (value.surfaceWebResults.platform==="Spokeo" ){
                spokeo_records.push(value)
            }
        })

        nonmatches.map((value, index) => {
            value['match'] = 'no'
            if(value.surfaceWebResults.platform==="Anywho" ){ 
                anywho_records.push(value)
            } else if (value.surfaceWebResults.platform==="Zabasearch" ){
                zabasearch_records.push(value)
            }else if (value.surfaceWebResults.platform==="Mylife" ){
                mylife_records.push(value)
            }else if (value.surfaceWebResults.platform==="Peekyou" ){
                peekyou_records.push(value)
            }else if (value.surfaceWebResults.platform==="Spokeo" ){
                spokeo_records.push(value)
            }
        })

        var dbresponse_organized = {}
        var PSEs = this.state.searchEngines
        PSEs.anywho['results'] = anywho_records
        PSEs.zabasearch['results'] = zabasearch_records
        PSEs.mylife['results'] = mylife_records
        PSEs.peekyou['results'] = peekyou_records
        PSEs.spokeo['results'] = spokeo_records

        this.setState({
            predictionMatches: matches,
            predictionnonMatches: nonmatches,
            dbresponse_organized: dbresponse_organized,
            searchEngines: PSEs,
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

    render() {
        return [
            //searching functionality
                <div className="searching-functionality">
                {this.state.showSearch && 
                    <Searchbar 
                        handleSubmit={this.handleSubmit} searchValue={this.state.searchValue} 
                        zipValue={this.state.zipValue} nameValue={this.state.nameValue} 
                        fieldName={this.state.fieldName} >
                    </Searchbar>}
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
                        <h1 className="text-center">We found {this.state.dbResponse.length} record{this.state.es} in our collections.</h1>
                        <h1 className="text-center">Please select yours:</h1>
                        <div className="row">
                            {this.state.dbResponse.length === 2 && <div className="col-2" style={{paddingBottom: "10px"}}></div>}
                            {this.state.dbResponse.length === 1 && <div className="col-4" style={{paddingBottom: "10px"}}></div>}
                        {this.state.dbResponse.map((value, index) => {
                            
                            return  <div className="col-4" style={{paddingBottom: "10px"}}>
                                <div className="card" onClick={(e) => this.chooseDbResponse(index, e)}
                                    style= {{paddingBottom: "2rem", paddingRight: "1rem", paddingLeft: "1rem", borderRadius: "2rem",
                                            backgroundColor:"#609cd4", cursor: 'pointer', height:'100%', width: '100%'}}
                                >
                                    <div style={{marginBottom: "1rem"}} className="row justify-content-center">
                                        <img src='cardProfileImage.png' style={{height:'50px', width: '50px'}} alt={"card profile#" + index }></img>
                                    </div>
                                    <table className="dbresponse-table">
                                        <tbody >
                                        <tr style={{backgroundColor: "#283c64"}}>
                                            <th>&nbsp;&nbsp;Name</th>
                                            <th className="text-capitalize">&nbsp;&nbsp;{value.name}</th>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;&nbsp;Phone Number</td>
                                            <td>&nbsp;&nbsp;{value.phoneNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;&nbsp;Birth Year</td>
                                            <td>&nbsp;&nbsp;{value.birthyear}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        })}
                        </div>
                        <div className="row justify-content-center">
                        <div className="col-6">
                            <Alert id="alert-norecordsfound" onClick={(e) => this.displayGoodNews(e)}>
                                None of these records are mine.
                            </Alert>
                        </div>
                        </div>
                    </div>
                }
                </div>
                </div>
                </>,

                //show entity resolution results
                <div className="container">
        
                {this.state.showERResults && 
                
                <div className="row justify-content-center">
                    <div className="col-lg-12">

                        <div className="text-right"><h2 className="text-left">Entity Resolution...<a onClick={(e) => this.showMCA(e)} style={{cursor: "pointer", float:'right',color:'white'}}> <u>Click here to learn more about entity resolution.</u></a></h2></div>
                        <div className="row" style={{marginBottom:'1rem'}}>
                            <DarkWebTable dbresponse={this.state.sample_cleanRecords}></DarkWebTable>
                        </div>
                        <div className="row">
                            <SurfaceWebTable searchEngines={this.state.searchEngines}></SurfaceWebTable>
                        </div>
                    </div>
                    <u style={{cursor:"pointer"}} onClick={(e) => this.goBack(e)}><p>Go back</p></u>
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

            //show PSE loaders 
                <div className="container d-flex justify-content-center">
                {this.state.showLoaders && 
                    <div className="col-lg-10">
                        <h1>Searching...</h1>
                    <div className="row justify-content-center">
                   
                        <> 
                            {Object.entries(this.state.searchEngines).map(([key, value]) => {
                                return <div className="">
                                <div className="row pse-loader-wrapper">
                                    <div className="card pse-loader"
                                        style= {{backgroundColor:value.color}}
                                    >
                                        <p><b>{key}</b></p>
                                    </div>
                                    {value.hasArrow && <GoArrowRight size={'2em'}></GoArrowRight>}
                                </div>
                                &nbsp;{value.text}
                                </div>
                            })}
                        </>
                    
                        </div>
                    </div>
                }
                </div>,

            //show PSE tables
                <div className="container d-flex justify-content-center">
                    <div className="col-lg-10">
                    <div className="row justify-content-center">
                    {this.state.showPSETable && 
                        <> 
                            <h1>You can find your PII on the following platforms: </h1>
                            {/* <table width="100%" style={{border: "3px solid white"}}> */}
                            <table width="100%" className="pse-table">
                                <thead>
                                <tr style={{backgroundColor: "#609cd4"}}>
                                    <th>&nbsp;&nbsp;Platform</th>
                                    <th>&nbsp;&nbsp;Available PII</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.entries(this.state.searchEngines).map( ([key, value]) => {
                                    if(value.platform_attributes.length > 1) {
                                        return <>
                                        <tr style={{backgroundColor: "white"}}>
                                            <td><img src={key+'.jpg'} style={{width:'273px'}} alt='nada'></img></td>
                                            <td>&nbsp;&nbsp;
                                                {value.platform_attributes.map((value, index) => {
                                                    return <span style={{marginRight:'15px'}}className=""> <figure style={{display: "inline-block"}}> <img src={value+'.png'} style={{marginTop: '25px', width: '65px', height: '65px'}} alt='nada'></img> <figcaption style={{color:"black"}}className="text-center"> {value} </figcaption> </figure> </span>
                                                })}
                                            </td>
                                        </tr>
                                        </>
                                    }
                                })}
                                
                                </tbody>
                            </table>
                        </>
                    }
                        </div>
                    </div>
                </div>,

                //show email profile
                <div className="container d-flex justify-content-center">
                    <div className="col-lg-10">
                    <div className="row justify-content-center">
                    {this.state.showEmailProfile && 
                        <> 
                        
                        <p style={{color:'white', fontSize: 'large'}} class="pretext"><i>Your Information has been compromised in 1 breach</i></p>
                        
                        <div class="header">BREACHES YOUR INFORMATION WAS COMPROMISED IN</div>
                        <table class="data_table">
                        <thead>
                            <tr>
                            <th>Breaches</th>
                            <th>Time</th>
                            <th>Compromised Data</th>
                            <th># of Records</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {Object.entries(this.state.email_breach).map( ([key, value]) => {
                                    return <tr>
                                    <td>{key}</td>
                                    <td>{value[0]}</td>
                                    <td>Email address, passwords</td>
                                    <td>{value[1]}</td>
                                    </tr>
                            })}
                            
                            
                        </tbody>
                        </table>

                        <div class="header2">YOUR PRIVACY RISK SCORE</div>
                        <table class="data_table">
                        <tbody class="right">
                            <tr>
                            <td rowspan="2">
                                <GaugeChart 
                                 id="gauge-chart2" 
                                 nrOfLevels={3} 
                                 percent={.1833 / 4.183}
                                 // percent={.49}
                                 textColor={"#000000"} 
                                 arcsLength={[0.333, 0.334, 0.333]}
                                 style={{width:'100%'}}
                                 arcPadding={0}
                                 cornerRadius={2}
                                 hideText={true}
                             />
                            </td>
                            <td>Your privacy risk score: 0.18.</td>
                            </tr>
                            <tr style={{height: "74px"}}>
                            <td>Your privacy risk score is low risk compared to others in your age group.</td>
                            </tr>
                        </tbody>
                        </table>

                        <div class="header">HOW YOUR SCORE COMPARES</div>
                        <div style={{backgroundColor:'white', maxWidth: "600px", color:'black'}} className="col-lg-12">
                        <Boxplot bottomColor="#00FF00" topColor="#FF0000" score={this.state.score}></Boxplot>
                        </div>
                        </>
                    }
                        </div>
                    </div>
                </div>,

                //show user profile
                <div className="container d-flex justify-content-center">
                    <div className="col-lg-10">
                    <div className="row justify-content-center">
                    {this.state.showProfile && 
                        <> 
                        
                        <p style={{color:'white', fontSize: 'large'}} class="pretext"><i>Your Information has been compromised in 1 breach and is published by {this.state.num_pse} people search engine{this.state.num_pse !== 1 && 's'}</i></p>
                        
                        <div class="header">BREACHES YOUR INFORMATION WAS COMPROMISED IN</div>
                        <table class="data_table">
                        <thead>
                            <tr>
                            <th>Breaches</th>
                            <th>Time</th>
                            <th>Compromised Data</th>
                            <th># of Records</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {Object.entries(this.state.db_breach).map( ([key, value]) => {
                                    return <tr>
                                    <td>{key}</td>
                                    <td>{value[0]}</td>
                                    <td>Email address, year of birth, city, address, zip</td>
                                    <td>{value[1]}</td>
                                    </tr>
                            })}
                            
                            
                        </tbody>
                        </table>
                            
                            
                        {this.state.num_pse > 0 && 
                            <div>
                            <div style={{width:'600px'}}class="header">AVAILABLE PII ON SEARCH ENGINES</div>
                            <table class="data_table">
                            <thead>
                                <tr>
                                <th>Information</th>
                                <th>Sources</th>
                                {/* <th>Remove the attributes from the source</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(this.state.searchEngines).map( ([key, value]) => {
                                    if(value.platform_attributes.length > 1) {
                                        return <>
                                    <tr>
                                        <td>{value.platform_attributes.map((value2, index) => {
                                                return <>{value.platform_attributes.length === index+1 ? 
                                                this.state.privacyAttributesDict[value2] 
                                                : 
                                                this.state.privacyAttributesDict[value2]+', '}
                                                    
                                                </>
                                            })}</td>
                                        
                                        <td>{key}</td>
                                        {/* <td><a target="_blank" rel="noopener noreferrer" href={this.state.searchEngines[key]['removeDataURL']} >Click here to view the removal process</a></td> */}
                                        </tr>
                                        </>
                                    }
                                })}
                                
                            </tbody>
                            </table>
                            </div>
                        }
                        <div class="header2">YOUR PRIVACY RISK SCORE</div>
                        <table class="data_table">
                        <tbody class="right">
                            <tr>
                            <td rowspan="2">
                                <GaugeChart 
                                 id="gauge-chart2" 
                                 nrOfLevels={3} 
                                 percent={this.state.entity.score / 4.183}
                                 // percent={.49}
                                 textColor={"#000000"} 
                                 arcsLength={[0.333, 0.334, 0.333]}
                                 style={{width:'100%'}}
                                 arcPadding={0}
                                 cornerRadius={2}
                                 hideText={true}
                             />
                            </td>
                            <td>Your privacy risk score: {this.state.entity['score']}. <u onClick={(e) => this.showScoreCalculation(e)} style={{cursor:'pointer'}}>Click here to view how your score is calculated.</u></td>
                            </tr>
                            <tr style={{height: "74px"}}>
                            <td>Your privacy risk score is low risk compared to others in your age group. <u onClick={(e) => this.showER(e)} style={{cursor:'pointer'}}>Click here to see how your profile was put together.</u></td>
                            </tr>
                        </tbody>
                        </table>

                        <div class="header">HOW YOUR SCORE COMPARES</div>
                        <div style={{backgroundColor:'white', maxWidth: "600px", color:'black'}} className="col-lg-12">
                        <Boxplot bottomColor="#00FF00" topColor="#FF0000" score={this.state.score}></Boxplot>
                        </div>
                        </>
                    }
                        </div>
                    </div>
                </div>,

                //show user score calculation
                <div className="container justify-content-center">
                    <div className="col-lg-10">
                    <div className="row justify-content-center">
                    {this.state.showScoreCalculation && 
                        <> 
                            <figure className="row justify-content-center">
                                <img src='score_weights3.png' style={{width:"75%", backgroundColor:'white'}} alt={"score_weights"}></img>
                                <figcaption><a style={{color:"white"}} href="https://doi.org/10.1109/ICACCI.2013.6637504" rel="noopener noreferrer" target="_blank">(Srivastava, A., and Geethakumari, G. 2013. "Measuring Privacy Leaks in Online Social Networks")</a></figcaption>
                            </figure>
                            <h2 className="text-center" style={{width:"100%"}}>Your privacy risk score is <b>{this.state.entity['score']}</b>. </h2>
                            <h2 className="text-center" style={{width:"100%"}}>The following attributes have been leaked:</h2>
                            <br></br>
                            <div className="text-center" style={{width:"100%"}}>
                                {Object.entries(this.state.entity['scored_attributes']).map( ([key, value]) => {
                                        return <>
                                        {this.state.privacyAttributesDict[key]},&nbsp;
                                        </>
                                })}
                            </div>
                            <br></br>
                            <div style={{width:"100%"}}><u style={{cursor:"pointer"}} onClick={(e) => this.goBack(e)}>Go back</u></div>
                        </>
                    }
                        </div>
                    </div>
                </div>,

                // //show removal process
                // <div className="container d-flex justify-content-center">
                //     <div className="col-lg-10">
                //     <div className="row justify-content-center">
                //     {this.state.showRemovalProcess && 
                //         <> 
                //             <h1 className="text-center" style={{width:"100%"}}>How to remove your data from PSEs:</h1>
                //             <div style={{width:"100%"}}><u style={{cursor:"pointer"}} onClick={(e) => this.goBack(e)}>Go back</u></div>
                //         </>
                //     }
                //         </div>
                //     </div>
                // </div>,

                //show MCA
                <div className="container d-flex justify-content-center">
                    <div className="col-lg-10">
                    <div className="row justify-content-center">
                    {this.state.showMCA && 
                        <> 
                            <h1 className="text-center" style={{width:"100%"}}>Multi-Context Attention (MCA)</h1>
                            <p>A deep learning-based entity resolution model, Multi-Context Attention (MCA), 
                                is leveraged to link candidate records returned from PSEs to the user's input 
                                and breached data collection. Figure 1 below illustrates the process of entity resolution.
                            </p>
                            <figure style={{display: "inline-block"}}> 
                                <img className="mca-image" src={'mca1.png'} style={{backgroundColor:"white"}} alt='nada'></img> 
                                <figcaption className="text-center">Figure 1. The process of entity resolution</figcaption> 
                            </figure>

                            <p>We adopt MCA due to its robustness in processing incomplete, inaccurate, 
                                and redundant records from heterogeneous sources. MCA leverages three deep 
                                learning-based attention mechanisms to focus on the most discriminative features:
                                <ol>
                                <li><b>Self-attention</b>: facilitates word disambiguation by capturing the relationship between a word and the record it belongs to. </li>
                                <li><b>Pair-attention</b>: jointly learns from the record pair to automatically identify key words that are critical in determining a matched pair.</li>
                                <li><b>Global-attention</b>: emphasizes highly discriminative words in the entire training dataset.</li>
                                </ol>
                            </p>
                            <figure style={{display: "inline-block"}}> 
                                <img className="mca-image" src={'mca2.png'} alt='nada'></img> 
                                <figcaption className="text-center">Figure 2. Multi-Context Attention (MCA) model</figcaption> 
                            </figure>

                            <h2 className="text-center" style={{width:"100%"}}>Comparison of MCA and TFIDF Models</h2>
                            <p>We compared MCA against TFIDF to illustrate how MCA outperformed traditional ER techniques (Figure 11). TFIDF is a frequency-based 
                                text embedding technique that learned the importance of each term based on term frequency divided by inverse document frequency.
                            </p>

                            <figure style={{display: "inline-block"}}> 
                                <img className="mca-image" src={'mca3.jpg'} style={{backgroundColor:"white"}} alt='nada'></img> 
                                <figcaption className="text-center">Figure 3. An example of predicting results from MCA method and TFIDF method.</figcaption> 
                            </figure>

                            <div style={{width:"100%"}}><u style={{cursor:"pointer"}} onClick={(e) => this.showMCA(e)}>Go back</u></div>
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
                <div className="breach-stats" >
                    {this.state.showBreachTotals && 
                    <>
                    <div className='row justify-content-center'>
                        <div className="col-lg-2">
                            <div className="row justify-content-center"> 
                                Our Collections:
                            </div>
                        </div> 
                        <div className="col-lg-2">
                            <div className="row justify-content-center"> 
                                Leaked Emails
                            </div>
                            <div className="row justify-content-center"> 
                                {this.state.numEmails}
                            </div>
                        </div> 
                        <div className="col-lg-2">
                            <div className="row justify-content-center"> 
                                Leaked Names
                            </div>
                            <div className="row justify-content-center"> 
                                {this.state.numNames}
                            </div>
                        </div> 
                    </div>
                    </>
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
                <div style={{paddingTop:'100px'}}className='row justify-content-center'>
                    How do I protect myself? Find out&nbsp;<a style={{color: "inherit"}}href="/ProtectYourself"><u>here</u></a>.
                </div>
                </>
                }
            </div>,

            <div style={{marginTop:'100px'}}>
            </div>,
                    

        ]
    }
}

export default Homepage;
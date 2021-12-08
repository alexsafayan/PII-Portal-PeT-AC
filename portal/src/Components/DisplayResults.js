import React from 'react';
import Table from 'react-bootstrap/Table'
import { IoMdCheckmarkCircle, IoIosCloseCircleOutline, IoIosInformationCircleOutline as InfoIcon } from "react-icons/io";
import ReactTooltip from 'react-tooltip'





class DisplayResults extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        entity: this.props.entity,
        sources: this.props.sources,
        datesCollected: this.props.datesCollected,
        score: 0,
        mcaDescription: "AI powered entity matching model. Learn more here"
      };
    }

    render() {
        return (
            <div>
                {this.state.score > 0 ? 
                    <div className="text-center">
                        <h6>The following table displays the attributes we are able to discover about you through the dark net and surface web searches.</h6>
                        {/*<h6>The scores represent how potentially damaging each piece of information can be if it gets in the wrong hands.</h6>*/}
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Leaked Personal Attribute</th>
                            <th>Potential Threat</th>
                            <th>Sensitivity Level</th>
                            <th>Sources</th>
                            <th>Date Collected</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.entity.phoneNum ? <tr><td>phone number</td><td>spam</td><td>high</td><td>{this.state.sources.phoneNum}</td><td>{this.state.datesCollected.phoneNum}</td></tr> : null}
                        {this.state.entity.email ? <tr><td>email</td><td>spam, phishing</td><td> low</td><td>{this.state.sources.email}</td><td>{this.state.datesCollected.email}</td></tr> : null}
                        {this.state.entity.password ? <tr><td>password</td><td>access to private accounts</td><td>{this.state.sources.password}</td><td>{this.state.datesCollected.password}</td><td> high</td></tr> : null}
                        {this.state.entity.address ? <tr><td>address</td><td>spam</td><td> high</td><td>{this.state.sources.address}</td><td>{this.state.datesCollected.address}</td></tr> : null}
                        {this.state.entity.birthday ? <tr><td>birthday</td><td>identity theft</td><td>low</td><td>{this.state.sources.birthday}</td><td>{this.state.datesCollected.birthday}</td></tr> : null}
                        {this.state.entity.hometown ? <tr><td>hometown</td><td>identity theft</td><td>low</td><td>{this.state.sources.zip}</td><td>{this.state.datesCollected.zip}</td></tr> : null}
                        {this.state.entity.currentTown ? <tr><td>current town</td><td>identity theft</td><td>low</td><td>{this.state.sources.currentTown}</td><td>{this.state.datesCollected.currentTown}</td></tr> : null}
                        {this.state.entity.jobDetails ? <tr><td>job details</td><td>identity theft</td><td>low</td><td>{this.state.sources.jobDetails}</td><td>{this.state.datesCollected.jobDetails}</td></tr> : null}
                        {this.state.entity.relationshipStatus ? <tr><td>relationship status</td><td>spam</td><td>high</td><td>{this.state.sources.relationshipStatus}</td><td>{this.state.datesCollected.relationshipStatus}</td></tr> : null}
                        {this.state.entity.interests ? <tr><td>interests</td><td>phishing</td><td>low</td><td>{this.state.sources.interests}</td><td>{this.state.datesCollected.interests}</td></tr> : null}
                        {this.state.entity.politicalViews ? <tr><td>political views</td><td>discrimination</td><td> high</td><td>{this.state.sources.politicalViews}</td><td>{this.state.datesCollected.politicalViews}</td></tr> : null}
                        {this.state.entity.religiousViews ? <tr><td>religious views</td><td>discrimination</td><td> high</td><td>{this.state.sources.religiousViews}</td><td>{this.state.datesCollected.religiousViews}</td></tr> : null}
                        </tbody>
                        </Table>
                    </div> 
                    : 
                    null
                }
            </div>
        )
      }
    
}




class ResultsTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    render() {
        return (
            <div>
                <Table striped bordered hover  style={{fontSize: "large", color:"#F2F2F2"}}>
                    <thead>
                        <tr>
                        <th>Platform</th>
                        <th>Leaked Attributes</th>
                        <th>MCA Matching Results
                            <a data-tip={'dummystring'} data-event={'click focus'}
                            data-for={'tooltip'}><InfoIcon style={{cursor:"pointer"}} size=".75em" onClick={() => { ReactTooltip.show(this.fooRef) }}></InfoIcon></a>
                            <ReactTooltip id={'tooltip'} effect="solid"
                                clickable={true} place="right"
                                getContent={function() {
                                return (
                                        <div>
                                        <span>AI powered entity matching model. </span>
                                        <a style={{color:"inherit"}} href="/about#mca"><u>Learn more here.</u></a>
                                        </div>
                                )
                            }}/>
                        </th>
                        <th>TF/IDF Matching Results</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.matches.map((value, index) => {
                        return <>
                            <tr style={{backgroundColor:"#E2F0D9", color:"black"}}>
                                <td>{value.surfaceWebResults.platform}</td>
                                <td  style={{textAlign: 'left'}}>{value.attributes}</td>
                                <td><IoMdCheckmarkCircle style={{fontSize: '2em'}}></IoMdCheckmarkCircle></td>
                                <td>{value.tfidf_value >= 0.5 ? <IoMdCheckmarkCircle style={{fontSize: '2em'}}></IoMdCheckmarkCircle> : <IoIosCloseCircleOutline style={{fontSize: '2em'}}></IoIosCloseCircleOutline>}</td>
                            </tr>
                        </>
                    })}
                    {this.props.nonmatches.map((value, index) => {
                        return <>
                            <tr style={{backgroundColor:"#ffd4dc", color:"black"}}>
                                <td>{value.surfaceWebResults.platform}</td>
                                <td  style={{textAlign: 'left'}}>{value.attributes}</td>
                                <td><IoIosCloseCircleOutline style={{fontSize: '2em'}}></IoIosCloseCircleOutline></td>
                                <td>{value.tfidf_value >= 0.5 ? <IoMdCheckmarkCircle style={{fontSize: '2em'}}></IoMdCheckmarkCircle> : <IoIosCloseCircleOutline style={{fontSize: '2em'}}></IoIosCloseCircleOutline>}</td>
                            </tr>
                        </>
                    })}
                    <tr></tr>
                    </tbody>
                </Table>
            </div>
        )
      }
    
}

class DatabaseTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    render() {
        return (
            <div>
                <Table striped bordered hover  style={{fontSize: "large", color:"#F2F2F2"}}>
                    <thead>
                        <tr>
                        <th>Platform</th>
                        <th>Leaked Attributes</th>
                        </tr>
                    </thead>
                    <tbody>

                    <tr style={{backgroundColor:"#b4c7e7", color:"black"}}>
                        <td>{this.props.dbresponse.platform}</td>
                        <td>{this.props.dbresponse.attributes}</td>
                    </tr>

                    <tr></tr>
                    </tbody>
                </Table>
            </div>
        )
      }
    
}

class DarkWebTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    render() {
        return (
            <div className='container d-flex justify-content-center' style={{borderRadius: "2rem", backgroundColor:"#609cd4", height:'200%', width: '100%'}}>
                
                <div className="card"
                    style= {{ backgroundColor:"#609cd4", height:'80%', width: '90%',paddingBottom:'1rem',paddingTop:'1rem', border: '0px'}}
                >
                    <h2 className="text-left"><u>Dark Web: Our Breached Data Collection</u></h2>
                    <h2 className="text-left"><u>Sources: {this.props.dbresponse.platform}</u></h2>
                    <table style={{fontSize: "large", color:"#F2F2F2", border: '2px solid black'}}>
                        <thead style={{backgroundColor:'#282c34'}}>
                            <tr>
                            <th style={{border: '2px solid black'}}>Name</th>
                            <th style={{border: '2px solid black'}}>YOB</th>
                            <th style={{border: '2px solid black'}}>City</th>
                            <th style={{border: '2px solid black'}}>Address</th>
                            <th style={{border: '2px solid black'}}>ZIP Code</th>
                            </tr>
                        </thead>
                        <tbody style={{backgroundColor:'white'}}>

                        <tr style={{backgroundColor:"white", color:"black", border: '2px solid black'}}>
                            <td className="text-capitalize"  style={{border: '2px solid black'}}>{this.props.dbresponse.name}</td>
                            <td style={{border: '2px solid black'}}>{this.props.dbresponse.birthyear}</td>
                            <td className="text-capitalize"  style={{border: '2px solid black'}}>{this.props.dbresponse.city}</td>
                            <td style={{border: '2px solid black'}}>{this.props.dbresponse.address}</td>
                            <td style={{border: '2px solid black'}}>{this.props.dbresponse.zip}</td>
                        </tr>

                        <tr></tr>
                        </tbody>
                </table>
                </div>
                
            </div>
        )
      }
    
}

class SurfaceWebTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    render() {
        return (
            <>
            <div className='container d-flex justify-content-center' style={{borderRadius: "2rem", backgroundColor:"#609cd4", height:'200%', width: '100%', marginBottom:'1rem'}}>
                    
                    <div className="card"
                        style= {{ backgroundColor:"#609cd4", height:'80%', width: '90%',paddingBottom:'1rem',paddingTop:'1rem', border: '0px'}}
                    >
            <h2 className="text-left"><u>Surface Web: People Search Engines</u></h2>


            {Object.entries(this.props.searchEngines).map( ([key, value]) => {
                return <>
                    {value.results.length > 0 &&
                    <>
                    <img src={value.results[0].surfaceWebResults.platform+'.jpg'} style={{width:'250px',marginBottom:'0.5rem'}} alt='nada'></img>
                        <table style={{fontSize: "large", color:"#F2F2F2", border: '2px solid black',marginBottom:'1rem'}}>
                            
                            <thead style={{backgroundColor:'#282c34'}}>
                                <tr>
                                <th style={{border: '2px solid black', width:'20%'}}>Name</th>
                                <th style={{border: '2px solid black', width:'10%'}}>DOB</th>
                                <th style={{border: '2px solid black', width:'25%'}}>Address</th>
                                <th style={{border: '2px solid black', width:'10%'}}>ZIP Code</th>
                                <th style={{border: '2px solid black', width:'25%'}}>Phone Number</th>
                                <th style={{border: '2px solid black', width:'10%'}}>Match</th>
                                </tr>
                            </thead>
                            <tbody style={{backgroundColor:'white', border: '2px solid black'}}>


                            {value.results.map((entry, index) => {
                                return <tr style={{backgroundColor:"white", color:"black", border: '2px solid black'}}>
                                        <td className="text-capitalize" style={{border: '2px solid black'}}>{entry.surfaceWebResults.name}</td>
                                        <td style={{border: '2px solid black'}}>{entry.surfaceWebResults.birthday}</td>
                                        <td style={{border: '2px solid black'}}>{entry.surfaceWebResults.address}</td>
                                        <td style={{border: '2px solid black'}}>{entry.surfaceWebResults.zip}</td>
                                        {typeof(entry.surfaceWebResults.phoneNum) === typeof(['1','2']) ? 
                                        <td style={{border: '2px solid black'}}>{entry.surfaceWebResults.phoneNum[0]}</td>
                                        :
                                        <td style={{border: '2px solid black'}}>{entry.surfaceWebResults.phoneNum}</td>
                                        }
                                        {entry.match==='yes' ? 
                                        <td className="text-capitalize" style={{border: '2px solid black', backgroundColor:'#78ac44'}}>{entry.match}</td>
                                        :
                                        <td className="text-capitalize" style={{border: '2px solid black', backgroundColor:'#ff9c9c'}}>{entry.match}</td>
                                        }
                                        
                                    </tr>
                            })}
                            </tbody>   
                    </table>
                </>
            }
            </>
            })}

            </div> 
            </div>
            </>
        )
      }
    
}

export default DisplayResults;

export {
    ResultsTable,
    DatabaseTable,
    DarkWebTable,
    SurfaceWebTable
}
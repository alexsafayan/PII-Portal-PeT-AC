import React from 'react';
import '../App.css'


// export const BreachList = props => {
class BreachList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeList: 'all',
      allBreaches: [
      {
        name: 'Tormarket',
        date: 'Not sure',
        amtRecords: '831,949',
        attributes: 'name, country, state, city, zip code',
        imgPath: 'tormarketEdited.png',
        description: 'Tormarket is a relatively new ' +
                'drug-focused darknet site that is focused on supplying the drug market ' +
                'in New Zealand. The vast majority of the customers reside in New Zealand but some vendors '+
                'are willing to ship internationally as well. While Tormarket is a small site, '+
                'it is constantly growing.'
      },
      {
        name: 'Buyssn',
        date: 'Not sure',
        amtRecords: '5,750,090',
        attributes: 'name, year of birth, country, state, city, zip code',
        imgPath: 'buyssnEdited.jpg',
        description: 'need description '
      },
      {
        name: 'WT1Shop',
        date: 'Not sure',
        amtRecords: '54,912',
        attributes: 'name, year of birth, state, city, zip code',
        imgPath: 'genericbreach.jpg',
        description: 'need description '
      },
      {
        name: 'Aptoide',
        date: 'Not sure',
        amtRecords: '4,471,631',
        attributes: 'email, password',
        imgPath: 'genericbreach.jpg',
        description: 'need description '
      },
      {
        name: 'Minted',
        date: 'Not sure',
        amtRecords: '4,418,182',
        attributes: 'email, password, name, city, state, zip code, address, phone',
        imgPath: 'genericbreach.jpg',
        description: 'need description '
      },
      {
        name: 'Cit0day',
        date: 'Not sure',
        amtRecords: '13,896,285',
        attributes: 'email, password',
        imgPath: 'genericbreach.jpg',
        description: 'need description '
      },
      {
        name: '000Webhost',
        date: 'Not sure',
        amtRecords: '15,299,590',
        attributes: 'email, password',
        imgPath: 'genericbreach.jpg',
        description: 'need description '
      },
      {
        name: 'Collection #1',
        date: 'Not sure',
        amtRecords: '2,692,818,238',
        attributes: 'email, password',
        imgPath: 'genericbreach.jpg',
        description: 'need description '
      },
      {
        name: 'Collection #2-5',
        date: 'Not sure',
        amtRecords: '25,000,000,000+',
        attributes: 'email, password',
        imgPath: 'genericbreach.jpg',
        description: 'need description '
      },
    ],

    recentBreaches: [
      {
        name: 'Tormarket',
        date: 'Not sure',
        amtRecords: '831,949',
        attributes: 'name, country, state, city, zip code',
        imgPath: 'tormarketEdited.png',
        description: 'Tormarket is a relatively new ' +
                'drug-focused darknet site that is focused on supplying the drug market ' +
                'in New Zealand. The vast majority of the customers reside in New Zealand but some vendors '+
                'are willing to ship internationally as well. While Tormarket is a small site, '+
                'it is constantly growing.'
      },
    ]


    };
    //functions go here

    this.switchList = this.switchList.bind(this);
  }

  switchList(list,event) {
    var newList;
    if(list === 'all') {
      newList = 'recent';
    } else if (list === 'recent') {
      newList = 'all';
    }
    this.setState({
      activeList: newList
    })
    event.preventDefault();
  }

  render() {
    return (
      <div style={{color:'white'}}>
        <div className="col-lg-12">
          
          <div className = "row justify-content-center">
            <h1>DATA BREACH LIST</h1>
          </div>

        </div>
          <div className='row justify-content-center'>
            <div className="col-lg-3"></div>
              <div className="col-lg-3">
                   
                    {this.state.activeList === 'all' ?
                      <div className="row justify-content-center" style={{backgroundColor: '#F2F2F2', color:"#222A35"}}>
                        <h2 >Included Breaches</h2>
                      </div>
                      :
                      <div className="row justify-content-center" style={{cursor:'pointer'}} onClick={(e) => this.switchList(this.state.activeList, e)}>
                        <h2><u>Included Breaches</u></h2>
                      </div>
                    }
                  
              </div> 
              <div className="col-lg-3">
                  {this.state.activeList === 'recent' ?
                      <div className="row justify-content-center" style={{backgroundColor: '#F2F2F2', color:"#222A35"}}>
                        <h2 >Recent Breaches</h2>
                      </div>
                      :
                      <div className="row justify-content-center" style={{cursor:'pointer'}} onClick={(e) => this.switchList(this.state.activeList, e)}>
                        <h2><u>Recent Breaches</u></h2>
                      </div>
                    }
              </div> 
              <div className="col-lg-3"></div>
          </div>
          {/* <div className="row justify-content-center">
          <div className="col-lg-6" style={{paddingTop:"5vh", backgroundColor: '#F2F2F2'}}>&nbsp;</div></div> */}

          {this.state.activeList === 'all' ? 
          <div className='row justify-content-center' style={{overflowY: 'scroll', height:'60vh'}}>
          <div className="col-lg-6" style={{backgroundColor: '#F2F2F2', color:"#222A35"}}>
            {this.state.allBreaches.map((value, index) => {
              
                return <>
                  <div className="row justify-content-center" style={{marginTop: "3vh"}}>
                    <div className="col-lg-3">
                        <img src={value.imgPath} style={{height:"15vh"}} alt={value.name}></img>
                    </div>
                    
                    <div className="col-lg-9">
                      <div className="row">
                        <h2>{value.name}</h2>
                      </div>
                      <div className="row" style={{marginBottom: "-20px"}}>
                        <p>{value.date}</p>
                      </div>
                      <div className="row" style={{marginBottom: "-20px"}}>
                        <p><b>{value.amtRecords}</b> accounts compromised</p>
                      </div>
                      <div className="row" style={{marginBottom: "-20px"}}>
                        <p><b>Compromised data:</b> {value.attributes}</p>
                      </div>
                    </div>
                    
                    
              
                  </div>
                  <div className="row justify-content-left" style={{marginTop: '3vh'}}>
                    <div className="col-lg-1"></div>
                    <div className="col-lg-8">
                      {value.description}
                    </div>
                  </div>
                  <hr></hr>
                  </>
                      
            })}
              
          </div>
          
      </div>
          
          :
          <div className='row justify-content-center' style={{}}>
          <div className="col-lg-6" style={{backgroundColor: '#F2F2F2', color:"#222A35"}}>
            {this.state.recentBreaches.map((value, index) => {
              
                return <>
                  <div className="row justify-content-center" style={{marginTop: "3vh"}}>
                    <div className="col-lg-3">
                        <img src={value.imgPath} style={{height:"15vh"}} alt={value.name}></img>
                    </div>
                    
                    <div className="col-lg-9">
                      <div className="row">
                        <h2>{value.name}</h2>
                      </div>
                      <div className="row" style={{marginBottom: "-20px"}}>
                        <p>{value.date}</p>
                      </div>
                      <div className="row" style={{marginBottom: "-20px"}}>
                        <p><b>{value.amtRecords}</b> accounts compromised</p>
                      </div>
                      <div className="row" style={{marginBottom: "-20px"}}>
                        <p><b>Compromised data:</b> {value.attributes}</p>
                      </div>
                    </div>
                    
                    
              
                  </div>
                  <div className="row justify-content-left" style={{marginTop: '3vh'}}>
                    <div className="col-lg-1"></div>
                    <div className="col-lg-8">
                      {value.description}
                    </div>
                  </div>
                  <hr></hr>
                  </>
                      
            })}
              
          </div>
          
      </div>
          }
          


          &nbsp;
      </div>
    );
  };
}

export default BreachList;
  
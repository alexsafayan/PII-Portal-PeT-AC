import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import '../App.css'

class Searchbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldName: this.props.fieldName,
            searchValue: "",
            nameValue: "",
            zipValue: ""
        };
      }


    selectField(field, event) {
        event.preventDefault();
        this.setState({
            fieldName:field
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
        
        event.preventDefault();
    }
    render() {
      return (
        <div className='form-group row justify-content-center' style={{height:'75px'}}>
            <div className="col-lg-1" style={{paddingLeft: 0,paddingRight: 0}}>
            <Dropdown style={{backgroundColor: '#203864', color:'#B9BDC5', borderColor:'#656565', height:'100%'}}>
            <Dropdown.Toggle style={{width: '10.2rem', backgroundColor: '#203864', color:'#B9BDC5', borderColor:'#656565', height:'5rem', fontSize: 'x-large'}} id="dropdown-basic">
                Search By
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={(e) => this.selectField('Email', e)}>Email</Dropdown.Item>
                <Dropdown.Item onClick={(e) => this.selectField('Name + Zip', e)}>Name &amp; Zip</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            </div>
            {this.state.fieldName === 'Email' && 
                <div className="col-lg-4" style={{paddingLeft: 0,paddingRight: 0}}>
                    <input style={{height:'100%',  fontSize: 'large', width:'100%'}} id="search" className="form-control" type="search" placeholder="Email: " aria-label="Search" value={this.state.searchValue} onChange={(e) => this.handleChange('Email', e)} />
                </div> 
            }
            {this.state.fieldName === 'Name + Zip' && 
                <>
                <div className="col-lg-2" style={{paddingLeft: 0,paddingRight: 0}}>
                    <input style={{height:'100%',  fontSize: 'large', width:'100%'}} id="search" className="form-control" type="search" placeholder="Name: " aria-label="Search" value={this.state.nameValue} onChange={(e) => this.handleChange('Name', e)} />
                </div> 
                <div className="col-lg-2" style={{paddingLeft: 0,paddingRight: 0}}>
                    <input style={{height:'100%',  fontSize: 'large', width:'100%'}} id="search" className="form-control" type="search" placeholder="Zip: " aria-label="Search" value={this.state.zipValue} onChange={(e) => this.handleChange('Zip', e)} />
                </div> 
                </>
            }
            <div className="col-lg-1" style={{paddingLeft: 0,paddingRight: 0}}>
                <button 
                    style={{width: '10rem', height:'5rem',  backgroundColor: '#203864', color:'#B9BDC5', borderColor:'#656565', fontSize: 'x-large'}} 
                    className="btn" onClick={(e) => this.props.handleSubmit(this.state.fieldName,this.state.searchValue,this.state.nameValue,this.state.zipValue, e)}>
                    Search
                </button>
            </div>
        </div>
      )
    }
}

export default Searchbar;






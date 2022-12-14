import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown'

class Searchbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldName: this.props.fieldName,
            searchValue: "",
            nameValue: "",
            zipValue: "",
            css:    `.my-dropdown-menu{
                        background-color: #203864; 
                        border-color: #5d9ad1;
                        font-size: x-large;
                        width: 100%;
                    }
                    
                    .my-dropdown-menu-item{
                        color: #B9BDC5;
                    }
                    `
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
            <style>
                {this.state.css}
            </style>
            <div className="col-lg-2" style={{paddingLeft: 0,paddingRight: 0}}>
            {/* <Dropdown style={{backgroundColor: '#203864', color:'#B9BDC5', borderColor:'#656565', height:'100%'}}> */}
            <Dropdown className="my-dropdown">
            <Dropdown.Toggle style={{width: '100%', backgroundColor: '#203864', color:'#B9BDC5', borderColor:'#656565', height:'5rem', fontSize: 'x-large'}}>
                Search By
            </Dropdown.Toggle>
            <Dropdown.Menu className="my-dropdown-menu">
                <Dropdown.Item className="my-dropdown-menu-item" onClick={(e) => this.selectField('Email', e)}>Email</Dropdown.Item>
                <Dropdown.Item className="my-dropdown-menu-item" onClick={(e) => this.selectField('Name + Zip', e)}>Name &amp; Zip</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            </div>
            {this.state.fieldName === 'Email' && 
                <div className="col-lg-4" style={{paddingLeft: 0,paddingRight: 0}}>
                    <input style={{height:'100%',  fontSize: 'large', width:'150%'}} id="search" className="form-control" type="search" placeholder="Email: " aria-label="Search" value={this.state.searchValue} onChange={(e) => this.handleChange('Email', e)} />
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
            <div className="col-lg-2" style={{paddingLeft: 0,paddingRight: 0}}>
                <button 
                    style={{width: '100%', height:'5rem',  backgroundColor: '#203864', color:'#B9BDC5', borderColor:'#656565', fontSize: 'x-large'}} 
                    className="btn" onClick={(e) => this.props.handleSubmit(this.state.fieldName,this.state.searchValue,this.state.nameValue,this.state.zipValue, e)}>
                    Search
                </button>
            </div>
        </div>
      )
    }
}

export default Searchbar;






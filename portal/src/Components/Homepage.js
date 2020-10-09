import React from 'react';
import DisplayResults from './DisplayResults.js'
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';

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

class Homepage extends React.Component {

    

    constructor(props) {
        super(props);
        this.state = {
          showResults: false,
          results: "",
          inputValue: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.DisplayResults = React.createRef()
      }

    handleSubmit(event) {
        event.preventDefault();
        this.DisplayResults.current.setState(initialResultsState)
        //query data base and surface web
        //display returned results
        if(this.state.inputValue.length > 0) {
            this.DisplayResults.current.setState({
                email: true,
                address: true,
                password: true,
                phoneNumber: true,
                zip: true,
                ssn: true,
                databreach_sources: ['last.fm'],
                surfaceweb_sources: ['mylife', 'that\'s them']

            })
        }
    }

    handleChange(event) {
        this.setState({inputValue: event.target.value});
        event.preventDefault();
    }

    render() {
        return [
            
                <div className="jumbotron text-center">
                    <h1>AZSecure Privacy Portal</h1>
                    <p>Search. Know. Act.</p>
                </div>,
                <div className="container d-flex justify-content-center">
                    <form className="form-inline form-group row" onSubmit={this.handleSubmit}>
                        <input id="emailsearch" className="form-control" type="search" placeholder="Enter email address" aria-label="Search" value={this.state.inputValue} onChange={this.handleChange} />
                        <button className="btn btn-outline-dark" type="submit">Search</button>
                    </form>

                </div>,
                <div className="container d-flex justify-content-center">
                    <DisplayResults ref={this.DisplayResults}/>
                </div>

        ]
    }
}

export default Homepage;
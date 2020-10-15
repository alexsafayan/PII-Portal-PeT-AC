import React, {useState} from 'react';
import NavDropdown from './NavDropdown.js'
import SubscribeModal from './Sub.js'

const NavItem = props => {
    const pageURI = window.location.pathname+window.location.search
    const liClassName = (props.path === pageURI) ? "nav-item active" : "nav-item";
    const aClassName = props.disabled ? "nav-link disabled" : "nav-link"
    return (
      <li className={liClassName}>
        <a href={props.path} className={aClassName}>
          {props.name}
          {(props.path === pageURI) ? (<span className="sr-only">(current)</span>) : ''}
        </a>
      </li>
    );
}



class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.subscribe = this.subscribe.bind(this);
        this.Modal = React.createRef()
        
      }

    subscribe() {
        this.Modal.current.setState(
            {
                show:true
            }
        )
    }

    render() {
        
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                    <ul className="navbar-nav ml-auto w-100">
                        <NavItem path="/" name="Home" />
                        <li className="nav-item" onClick={this.subscribe} style={{cursor:'pointer'}}>
                            <a className="nav-link">
                                Subscribe For Notifications
                            </a>
                        </li>
                    </ul>
                    

                    <ul className="nav navbar-nav ml-auto w-100 justify-content-end">
                        <SubscribeModal ref={this.Modal}/>
                        <NavDropdown name="Take Action">
                            <a className="dropdown-item" href="/">Sign up for notifications</a>
                            <a className="dropdown-item" href="/">Another action</a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="/">Something else here</a>
                        </NavDropdown>
                        
                        <NavItem path="/about" name="About" />
                        <NavItem path="/faq" name="FAQ" />
                    </ul>
                    
                </div>
            </nav>
        )
    }

}

export default Navigation;
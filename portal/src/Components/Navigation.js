import React from 'react';
import NavDropdown from './NavDropdown.js'
import SubscribeModal from './Sub.js'
import '../App.css'

const NavItem = props => {
    const pageURI = window.location.pathname+window.location.search
    const liClassName = (props.path === pageURI) ? "nav-item active" : "nav-item";
    const aClassName = props.disabled ? "nav-link disabled" : "nav-link"
    return (
      <li className={liClassName} onClick={props.onClick}>
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
            <nav className="navbar navbar-expand-lg" style={{fontSize: 'x-large', fontWeight: 'bold'}}>
                
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <img src='UofALogo.png'></img>
                    <ul className="navbar-nav ml-auto w-100 justify-content-center" >
                        <NavItem path="/" name="Home" />
                        <NavItem path="/about" name="About" />
                        <NavItem path="#" name="Notify Me" onClick={this.subscribe}/>
                        <NavItem path="/#" name="Data Breach List" />
                        <NavItem path="/#" name="Protect Yourself" />
                        <NavItem path="/FAQ" name="FAQ" />
                        <SubscribeModal ref={this.Modal}/>
                        {/* <li className="nav-item" onClick={this.subscribe} style={{cursor:'pointer'}}>
                            <a className="nav-link">
                                Subscribe For Notifications
                            </a>
                        </li> */}
                    </ul>
                    
                </div>
            </nav>
        )
    }

    
}

export default Navigation;
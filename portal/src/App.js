import React, {Component} from 'react';
import './App.css';
import Navigation from './Components/Navigation.js'
import HeaderLogo from './Components/HeaderLogo.js'
import { Routes } from './Routes';


class App extends Component {
  render() {
    return(
      <div className="portal">
        <Navigation />
        <HeaderLogo />
        <Routes />
      </div>
    )
  };

}

export default App;

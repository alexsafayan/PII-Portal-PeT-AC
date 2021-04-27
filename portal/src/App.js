import React, {Component} from 'react';
import './App.css';
import Navigation from './Components/Navigation.js'
import Jumboboy from './Components/Jumboboy.js'
import { Routes } from './Routes';


class App extends Component {
  render() {
    return(
      <div className="portal">
        <Navigation />
        <Jumboboy />
        <Routes />
      </div>
    )
  };

}

export default App;

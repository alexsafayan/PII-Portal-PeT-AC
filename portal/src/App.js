import React, {Component} from 'react';
import './App.css';
import Navigation from './Components/Navigation.js'
import Homepage from './Components/Homepage.js'


class App extends Component {
  render() {
    return(
      <div>
        <Navigation />
        <Homepage />
      </div>
    )
  };

}

export default App;

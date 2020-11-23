import React from 'react';
//import { Home } from './views/Home';
import { About } from './views/About/about';
//import { NavBar } from './components/NavBar';
import { Route, Switch, Redirect } from 'react-router-dom';
import Homepage from './Components/Homepage.js'
import Search from './Components/Search.js'

export const Routes = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/Home" component={Homepage} />
        <Route exact path="/">
          <Redirect to="/Home" />
        </Route>
        <Route exact path="/about" component={About} />
        <Route exact path="/search" component={Search} />
      </Switch>
    </div>
  );
};
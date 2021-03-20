import React from 'react';
import { About } from './views/About/about.js';
import { Route, Switch, Redirect } from 'react-router-dom';
import Homepage from './Components/Homepage.js'
import Testing from './Components/Testing.js'
import Search from './Components/Search.js'

export const Routes = () => {
  return (
    <div>
      <Switch>
        <Route key="home" exact path="/Home" component={Homepage} />
        <Route key="tests" exact path="/Tests" component={Testing} />
        <Route key="nada" exact path="/">
          <Redirect to="/Home" />
        </Route>
        <Route key="about" exact path="/about" component={About} />
        <Route key="search" exact path="/search" component={Search} />
      </Switch>
    </div>
  );
};
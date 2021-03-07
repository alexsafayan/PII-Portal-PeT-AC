import React from 'react';
import { About } from './views/About/about';
import { Route, Switch, Redirect } from 'react-router-dom';
import Homepage from './Components/Homepage.js'
import Testing from './Components/Testing.js'
import Search from './Components/SearchTemp.js'

export const Routes = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/Home" component={Homepage} />
        <Route exact path="/Tests" component={Testing} />
        <Route exact path="/">
          <Redirect to="/Home" />
        </Route>
        <Route exact path="/about" component={About} />
        <Route exact path="/search" component={Search} />
      </Switch>
    </div>
  );
};
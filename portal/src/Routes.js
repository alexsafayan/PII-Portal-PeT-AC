import React from 'react';
import { About } from './views/about.js';
import { Faq } from './views/faq.js';
import { Route, Switch, Redirect } from 'react-router-dom';
//import Homepage from './Components/Homepage.js'
import Homepage from './Components/TestGuy.js'
import Search from './Components/Search.js'

export const Routes = () => {
  return (
    <div>
      <Switch>
        <Route key="home" exact path="/Home" component={Homepage} />
        <Route key="nada" exact path="/">
          <Redirect to="/Home" />
        </Route>
        <Route key="about" exact path="/about" component={About} />
        <Route key="faq" exact path="/FAQ" component={Faq} />
        <Route key="search" exact path="/search" component={Search} />
      </Switch>
    </div>
  );
};
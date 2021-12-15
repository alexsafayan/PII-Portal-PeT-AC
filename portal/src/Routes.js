import React from 'react';
import { About } from './views/about.js';
import { Faq } from './views/faq.js';
import { Route, Switch, Redirect } from 'react-router-dom';
import Homepage from './views/Homepage.js';
import { ProtectYourself } from './views/protectyourself.js';
import BreachList from './views/breachlist.js';
import Test from './views/test.js';

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
        <Route key="protectyourself" exact path="/ProtectYourself" component={ProtectYourself} />
        <Route key="breachlist" exact path="/DataBreachList" component={BreachList} />
        <Route key="test" exact path="/test" component={Test} />
      </Switch>
    </div>
  );
};
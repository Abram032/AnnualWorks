import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { RouteNames } from '../shared/consts/RouteNames';
import HomeContainer from '../pages/HomeContainer';
import SignIn from '../pages/auth/SignIn';
import SignOut from '../pages/auth/SignOut';
import Authorize from '../pages/auth/Authorize';

export const Routes: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={RouteNames.root} component={HomeContainer} />
      <Route exact path={RouteNames.signIn} component={SignIn} />
      <Route exact path={RouteNames.signOut} component={SignOut} />
      <Route path={RouteNames.authorize} component={Authorize} />
    </Switch>
  </BrowserRouter>
);

export default Routes;

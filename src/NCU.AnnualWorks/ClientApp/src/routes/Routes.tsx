import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { RouteNames } from '../shared/consts/RouteNames';
import HomeContainer from '../pages/homeContainer';
import SignIn from '../pages/auth/signIn';
import SignOut from '../pages/auth/signOut';
import Authorize from '../pages/auth/authorize';
import ThesisDetails from '../pages/thesisDetails/thesisDetails';
import ThesisForm from '../pages/thesisForm/thesisForm';
import Review from '../pages/thesisReview/thesisReview';

export const Routes: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={RouteNames.root} component={HomeContainer} />
      <Route exact path={RouteNames.signIn} component={SignIn} />
      <Route exact path={RouteNames.signOut} component={SignOut} />
      <Route path={RouteNames.authorize} component={Authorize} />
      <Route path={RouteNames.details} component={ThesisDetails} />
      <Route path={RouteNames.addthesis} component={ThesisForm} />
      <Route path={RouteNames.review} component={Review} />
    </Switch>
  </BrowserRouter>
);

export default Routes;

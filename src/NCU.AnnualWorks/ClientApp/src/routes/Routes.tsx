import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { RouteNames } from '../shared/consts/RouteNames';
import HomeContainer from '../pages/home/homeContainer';
import SignIn from '../pages/auth/SignIn';
import SignOut from '../pages/auth/SignOut';
import Authorize from '../pages/auth/Authorize';
import ThesisDetails from '../pages/thesisDetails/thesisDetails';
import ThesisForm from '../pages/thesisForm/thesisForm';
import ThesisReviewForm from '../pages/thesisReviewForm/thesisReviewForm';

export const Routes: React.FC = () => (
  <Switch>
    <Route exact path={RouteNames.root} component={HomeContainer} />
    <Route exact path={RouteNames.signIn} component={SignIn} />
    <Route exact path={RouteNames.signOut} component={SignOut} />
    <Route path={RouteNames.authorize} component={Authorize} />
    <Route exact path={RouteNames.details} render={props => <ThesisDetails guid={props.match.params.guid} />} />
    <Route path={RouteNames.addthesis} component={ThesisForm} />
    <Route path={RouteNames.review} component={ThesisReviewForm} />
  </Switch>
);

export default Routes;

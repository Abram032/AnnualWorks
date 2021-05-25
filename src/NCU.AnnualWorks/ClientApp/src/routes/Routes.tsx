import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteNames } from '../shared/consts/RouteNames';
import HomeContainer from '../pages/home/homeContainer';
import SignIn from '../pages/auth/SignIn';
import SignOut from '../pages/auth/SignOut';
import Authorize from '../pages/auth/Authorize';
import ThesisDetails from '../pages/thesisDetails/thesisDetails';
import ThesisCreateForm from '../pages/thesisCreateForm/thesisCreateForm';
import ThesisEditForm from '../pages/thesisEditForm/thesisEditForm';
import ThesisCreateReviewForm from '../pages/thesisCreateReviewForm/thesisCreateReviewForm';
import ThesisEditReviewForm from '../pages/thesisEditReviewForm/thesisEditReviewForm';
import NotFound from '../pages/NotFound';
import Forbidden from '../pages/Forbidden';
import Error from '../pages/Error';
import Privacy from '../pages/Privacy';
import About from '../pages/About';
import Search from '../pages/Search';

export const Routes: React.FC = () => (
  <Switch>
    <Route exact path={RouteNames.root} component={HomeContainer} />
    <Route exact path={RouteNames.signIn} component={SignIn} />
    <Route exact path={RouteNames.signOut} component={SignOut} />
    <Route path={RouteNames.authorize} component={Authorize} />
    <Route exact path={RouteNames.details} render={props => <ThesisDetails guid={props.match.params.guid} />} />
    <Route path={RouteNames.addThesis} component={ThesisCreateForm} />
    <Route exact path={RouteNames.editThesis} render={props => <ThesisEditForm guid={props.match.params.guid} />} />
    <Route exact path={RouteNames.addReview} render={props => <ThesisCreateReviewForm thesisGuid={props.match.params.thesisGuid} />} />
    <Route exact path={RouteNames.editReview} 
      render={props => <ThesisEditReviewForm thesisGuid={props.match.params.thesisGuid} reviewGuid={props.match.params.reviewGuid} />} 
    />
    <Route path={RouteNames.search} component={Search} />
    <Route path={RouteNames.error} component={Error} />
    <Route path={RouteNames.forbidden} component={Forbidden} />
    <Route path={RouteNames.notFound} component={NotFound} />
    <Route path={RouteNames.privacy} component={Privacy} />
    <Route path={RouteNames.about} component={About} />
    <Redirect to={RouteNames.notFound} />
  </Switch>
);

export default Routes;

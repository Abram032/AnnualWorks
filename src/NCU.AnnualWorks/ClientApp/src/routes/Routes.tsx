import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteNames } from '../shared/Consts';
import HomeContainer from '../pages/home/HomeContainer';
import SignIn from '../pages/auth/SignIn';
import SignOut from '../pages/auth/SignOut';
import Authorize from '../pages/auth/Authorize';
import ThesisDetails from '../pages/thesisDetails/ThesisDetails';
import ThesisCreateForm from '../pages/thesisCreateForm/ThesisCreateForm';
import ThesisEditForm from '../pages/thesisEditForm/ThesisEditForm';
import ThesisCreateReviewForm from '../pages/thesisCreateReviewForm/ThesisCreateReviewForm';
import ThesisEditReviewForm from '../pages/thesisEditReviewForm/ThesisEditReviewForm';
import NotFound from '../pages/NotFound';
import Forbidden from '../pages/Forbidden';
import Error from '../pages/Error';
import Privacy from '../pages/Privacy';
import About from '../pages/About';
import Search from '../pages/Search';
import AdminPanel from '../pages/admin/AdminPanel';
import AdminPanelAdministrators from '../pages/admin/AdminPanelAdministrators';
import AdminPanelUsers from '../pages/admin/AdminPanelUsers';
import AdminPanelDeadline from '../pages/admin/AdminPanelDeadline';
import AdminPanelCourse from '../pages/admin/AdminPanelCourse';
import AdminPanelExport from '../pages/admin/AdminPanelExport';

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
    <Route exact path={RouteNames.error} component={Error} />
    <Route exact path={RouteNames.forbidden} component={Forbidden} />
    <Route exact path={RouteNames.notFound} component={NotFound} />
    <Route exact path={RouteNames.privacy} component={Privacy} />
    <Route exact path={RouteNames.about} component={About} />
    <Route exact path={RouteNames.adminPanel} component={AdminPanel} />
    <Route exact path={RouteNames.adminPanelAdmins} component={AdminPanelAdministrators} />
    <Route exact path={RouteNames.adminPanelUsers} component={AdminPanelUsers} />
    <Route exact path={RouteNames.adminPanelDeadline} component={AdminPanelDeadline} />
    <Route exact path={RouteNames.adminPanelCourse} component={AdminPanelCourse} />
    <Route exact path={RouteNames.adminPanelExport} component={AdminPanelExport} />
    <Redirect to={RouteNames.notFound} />
  </Switch>
);

export default Routes;

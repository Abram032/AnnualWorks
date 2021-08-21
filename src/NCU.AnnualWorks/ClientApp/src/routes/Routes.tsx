import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouteNames } from '../shared/Consts';
import { HomeContainer } from '../pages/home/HomeContainer';
import { SignIn } from '../pages/auth/SignIn';
import { SignOut } from '../pages/auth/SignOut';
import { Authorize } from '../pages/auth/Authorize';
import { ThesisDetails } from '../pages/thesis/ThesisDetails';
import { ThesisCreateForm } from '../pages/thesis/ThesisCreateForm';
import { ThesisEditForm } from '../pages/thesis/ThesisEditForm';
import { ReviewCreateForm } from '../pages/review/ReviewCreateForm';
import { ReviewEditForm } from '../pages/review/ReviewEditForm';
import { NotFound }from '../pages/NotFound';
import { Forbidden } from '../pages/Forbidden';
import { Error } from '../pages/Error';
import { Privacy } from '../pages/Privacy';
import { About } from '../pages/About';
import { Search } from '../pages/Search';
import { AdminPanel, AuthenticatedWrapper } from '../Components';
import { AdminPanelAdministrators } from '../pages/admin/AdminPanelAdministrators';
import { AdminPanelUsers } from '../pages/admin/AdminPanelUsers';
import { AdminPanelDeadline } from '../pages/admin/AdminPanelDeadline';
import { AdminPanelCourse } from '../pages/admin/AdminPanelCourse';
import { AdminPanelExport } from '../pages/admin/AdminPanelExport';

export const Routes: React.FC = () => (
  <Switch>
    <Route exact path={RouteNames.root} component={HomeContainer} />
    <Route exact path={RouteNames.signIn} component={SignIn} />
    <Route exact path={RouteNames.signOut} component={SignOut} />
    <Route path={RouteNames.authorize} component={Authorize} />
    <Route exact path={RouteNames.error} component={Error} />
    <Route exact path={RouteNames.forbidden} component={Forbidden} />
    <Route exact path={RouteNames.notFound} component={NotFound} />
    <Route exact path={RouteNames.privacy} component={Privacy} />
    <Route exact path={RouteNames.about} component={About} />

    {/* Components requiring authentication below */}

    <Route path={RouteNames.search} render={props => (
      <AuthenticatedWrapper>
        <Search />
      </AuthenticatedWrapper>
    )} />

    <Route exact path={RouteNames.details} render={props => (
      <AuthenticatedWrapper>
        <ThesisDetails guid={props.match.params.guid} />
      </AuthenticatedWrapper>
    )} />

    <Route path={RouteNames.addThesis} component={ThesisCreateForm} />

    <Route exact path={RouteNames.editThesis} render={props => (
      <AuthenticatedWrapper>
        <ThesisEditForm guid={props.match.params.guid} />
      </AuthenticatedWrapper>
    )} />

    <Route exact path={RouteNames.addReview} render={props => (
      <AuthenticatedWrapper>
        <ReviewCreateForm thesisGuid={props.match.params.thesisGuid} />
      </AuthenticatedWrapper>
    )} />

    <Route exact path={RouteNames.editReview} render={props => (
      <AuthenticatedWrapper>
        <ReviewEditForm thesisGuid={props.match.params.thesisGuid} reviewGuid={props.match.params.reviewGuid} />
      </AuthenticatedWrapper>
    )} />

    <Route exact path={RouteNames.adminPanel} render={props => (
      <AuthenticatedWrapper>
        <AdminPanel />
      </AuthenticatedWrapper>
    )} />

    <Route exact path={RouteNames.adminPanelAdmins} render={props => (
      <AuthenticatedWrapper>
        <AdminPanel>
          <AdminPanelAdministrators />
        </AdminPanel>
      </AuthenticatedWrapper>
    )} />

    <Route exact path={RouteNames.adminPanelUsers} render={props => (
      <AuthenticatedWrapper>
        <AdminPanel>
          <AdminPanelUsers />
        </AdminPanel>
      </AuthenticatedWrapper>
    )} />

    <Route exact path={RouteNames.adminPanelDeadline} render={props => (
      <AuthenticatedWrapper>
        <AdminPanel>
          <AdminPanelDeadline />
        </AdminPanel>
      </AuthenticatedWrapper>
    )} />

    <Route exact path={RouteNames.adminPanelCourse} render={props => (
      <AuthenticatedWrapper>
        <AdminPanel>
          <AdminPanelCourse />
        </AdminPanel>
      </AuthenticatedWrapper>
    )} />

    <Route exact path={RouteNames.adminPanelExport} render={props => (
      <AuthenticatedWrapper>
        <AdminPanel>
          <AdminPanelExport />
        </AdminPanel>
      </AuthenticatedWrapper>
    )} />

    <Redirect to={RouteNames.notFound} />
  </Switch>
);

export default Routes;

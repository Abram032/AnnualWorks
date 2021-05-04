import React from "react";
import Layout from "./layout/Layout";
import { CookiesProvider } from "react-cookie";
import AuthenticationProvider from "./shared/providers/AuthenticationProvider";
import PersonalizationProvider from "./shared/providers/PersonalizationProvider";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomeContainer from "./pages/HomeContainer";
import SignIn from "./pages/auth/SignIn";
import SignOut from "./pages/auth/SignOut";
import Authorize from "./pages/auth/Authorize";
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { RouteNames } from "./shared/consts/RouteNames";
import "./styles/index.scss";

initializeIcons();

export const App: React.FC = () => {
  return (
    <CookiesProvider>
      <PersonalizationProvider>
        <AuthenticationProvider>
          <Layout>
            <BrowserRouter>
              <Switch>
                <Route exact path={RouteNames.root} component={HomeContainer} />
                <Route exact path={RouteNames.signIn} component={SignIn} />
                <Route exact path={RouteNames.signOut} component={SignOut} />
                <Route path={RouteNames.authorize} component={Authorize} />
              </Switch>
            </BrowserRouter>
          </Layout>
        </AuthenticationProvider>
      </PersonalizationProvider>
    </CookiesProvider>
  );
};

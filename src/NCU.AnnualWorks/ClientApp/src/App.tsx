import React from "react";
import Layout from "./layout/Layout";
import { ThemeProvider } from "@fluentui/react";
import {
  lightTheme,
  darkTheme,
  highContrastDarkTheme,
  highContrastLightTheme,
} from "./themes/themes";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/auth/SignIn";
import Authorize from "./pages/auth/Authorize";
import "./App.scss";
import "./styles/index.scss";

export const App: React.FunctionComponent = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <Layout>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/signin' component={SignIn} />
            <Route path='/authorize' component={Authorize} />
          </Switch>
        </BrowserRouter>
      </Layout>
    </ThemeProvider>
  );
};

import React from "react";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import { loadTheme, ThemeProvider } from "@fluentui/react";
import {
  lightTheme,
  darkTheme,
  highContrastDarkTheme,
  highContrastLightTheme,
} from "./themes/themes";
import "./App.scss";
import "./styles/index.scss";

export const App: React.FunctionComponent = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <Layout>
        <Home />
      </Layout>
    </ThemeProvider>
  );
};

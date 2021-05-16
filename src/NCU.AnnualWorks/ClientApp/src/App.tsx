import React from "react";
import Layout from "./layout/layout";
import Routes from './routes/Routes';
import { CookiesProvider } from "react-cookie";
import AuthenticationProvider from "./shared/providers/AuthenticationProvider";
import PersonalizationProvider from "./shared/providers/PersonalizationProvider";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { I18nextProvider } from "react-i18next";
import i18n from "./shared/localization/i18n";
import "./styles/index.scss";

initializeIcons();

export const App: React.FC = () => {
  return (
    <CookiesProvider>
      <I18nextProvider i18n={i18n}>
        <PersonalizationProvider>
          <AuthenticationProvider>
            <Layout>
              <Routes />
            </Layout>
          </AuthenticationProvider>
        </PersonalizationProvider>
      </I18nextProvider>
    </CookiesProvider>
  );
};

import React, { useEffect, useState } from "react";
import { CookieNames } from "../Consts";
import { useCookies } from "react-cookie";
import { ThemeProvider } from "@fluentui/react";
import { AvailableThemes } from "../../themes/Themes";
import { ThemeNames, ThemeName } from "../Consts";
import { LanguageNames, LanguageName } from "../Consts";
import { useTranslation } from "react-i18next";

interface IPersonalizationContext {
  themeName: ThemeName;
  switchTheme: (themeName: ThemeName) => void;
  languageName: LanguageName;
  switchLanguage: (languageName: LanguageName) => void;
}

export const PersonalizationContext = React.createContext<IPersonalizationContext>({
  themeName: ThemeNames.light,
  switchTheme: (themeName: ThemeName) => {},
  languageName: LanguageNames.Polish,
  switchLanguage: (languageName: LanguageName) => {}
});

export const PersonalizationProvider: React.FC = (props) => {
  const [cookies, setCookie] = useCookies([CookieNames.theme, CookieNames.language]);
  const defaultCookieOptions = {
    expires: new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 365 * 10)), //10 years
    httpOnly: false,
    secure: true,
    sameSite: true,
  };
  const saveThemeSettings = (themeName: ThemeName) => {
    setCookie(CookieNames.theme, themeName, defaultCookieOptions);
  };
  const saveLanguageSettings = (language: LanguageName) => {
    setCookie(CookieNames.language, language, defaultCookieOptions);
  }
  
  const [theme, setTheme] = useState<ThemeName>(() => {
    const themeName = cookies[CookieNames.theme];
    if(!themeName) {
      saveThemeSettings(ThemeNames.light);
      return ThemeNames.light;
    }

    return themeName;
  });

  const switchTheme = (themeName: ThemeName) => {
    setTheme(themeName);
    saveThemeSettings(themeName);
  }

  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<LanguageName>(() => {
    const languageName = cookies[CookieNames.language];
    if(!languageName) {
      saveLanguageSettings(LanguageNames.Polish);
      return LanguageNames.Polish;
    };

    return languageName;
  });

  const switchLanguage = (languageName: LanguageName) => {
    setLanguage(languageName);
    saveLanguageSettings(languageName);
  }

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  return (
    <ThemeProvider theme={AvailableThemes[theme]}>
      <PersonalizationContext.Provider value={{
        themeName: theme,
        switchTheme: (themeName: ThemeName) => switchTheme(themeName),
        languageName: language,
        switchLanguage: (languageName: LanguageName) => switchLanguage(languageName)
      }}>
        {props.children}
      </PersonalizationContext.Provider>
    </ThemeProvider>
  );
};

export default PersonalizationProvider;

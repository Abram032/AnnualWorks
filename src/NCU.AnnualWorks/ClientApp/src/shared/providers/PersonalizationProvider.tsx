import React, { useContext, useEffect, useState } from "react";
import { themeCookieName, languageCookieName } from "../consts/cookieNames";
import { useCookies } from "react-cookie";
import { PartialTheme, ThemeContext, ThemeProvider } from "@fluentui/react";
import {
  Theme,
  ThemeName,
  getThemeByName,
  lightTheme,
} from "../../themes/themes";

//TODO: Clean up

interface PersonalizationContextProps {
  theme: Theme;
  switchTheme: (themeName: ThemeName) => void;
}

export const PersonalizationContext = React.createContext<PersonalizationContextProps>({
  theme: {
    name: 'lightTheme',
    theme: lightTheme
  },
  switchTheme: (themeName: ThemeName) => {}
});

export const PersonalizationProvider: React.FC = (props) => {
  const [cookies, setCookie] = useCookies([themeCookieName, languageCookieName]);
  const saveSettings = (themeName: ThemeName) => {
    setCookie(themeCookieName, themeName, {
      expires: new Date((new Date).getTime() + (1000 * 60 * 60 * 24 * 365 * 10)), //10 years
      httpOnly: false,
      secure: true,
      sameSite: true,
    });
  };
  
  const [theme, setTheme] = useState<Theme>(() => {
    const themeName = cookies[themeCookieName];
    if(!themeName) {
      saveSettings('lightTheme');
      return {
        name: 'lightTheme',
        theme: lightTheme
      }
    }

    return {
      name: themeName,
      theme: getThemeByName(themeName)
    }
  });

  const switchTheme = (themeName: ThemeName) => {
    const theme = getThemeByName(themeName);
    setTheme({
      name: themeName,
      theme: theme
    });
    saveSettings(themeName);
  }

  return (
    <ThemeProvider theme={theme.theme}>
      <PersonalizationContext.Provider value={{
        theme: theme,
        switchTheme: (themeName: ThemeName) => switchTheme(themeName)
      }}>
        {props.children}
      </PersonalizationContext.Provider>
    </ThemeProvider>
  );
};

export default PersonalizationProvider;

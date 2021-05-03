import React, { useContext, useEffect, useState } from "react";
import { CookieNames } from "../consts/CookieNames";
import { useCookies } from "react-cookie";
import { PartialTheme, ThemeContext, ThemeProvider } from "@fluentui/react";
import { AvailableThemes } from "../../themes/themes";
import { ThemeNames, ThemeName } from "../consts/ThemeNames";
interface IPersonalizationContext {
  themeName: ThemeName;
  switchTheme: (themeName: ThemeName) => void;
}

export const PersonalizationContext = React.createContext<IPersonalizationContext>({
  themeName: ThemeNames.light,
  switchTheme: (themeName: ThemeName) => {}
});

export const PersonalizationProvider: React.FC = (props) => {
  const [cookies, setCookie] = useCookies([CookieNames.theme, CookieNames.language]);
  const saveSettings = (themeName: ThemeName) => {
    setCookie(CookieNames.theme, themeName, {
      expires: new Date((new Date).getTime() + (1000 * 60 * 60 * 24 * 365 * 10)), //10 years
      httpOnly: false,
      secure: true,
      sameSite: true,
    });
  };
  
  const [theme, setTheme] = useState<ThemeName>(() => {
    const themeName = cookies[CookieNames.theme];
    if(!themeName) {
      saveSettings(ThemeNames.light);
      return ThemeNames.light;
    }

    return themeName;
  });

  const switchTheme = (themeName: ThemeName) => {
    setTheme(themeName);
    saveSettings(themeName);
  }

  return (
    <ThemeProvider theme={AvailableThemes[theme]}>
      <PersonalizationContext.Provider value={{
        themeName: theme,
        switchTheme: (themeName: ThemeName) => switchTheme(themeName)
      }}>
        {props.children}
      </PersonalizationContext.Provider>
    </ThemeProvider>
  );
};

export default PersonalizationProvider;

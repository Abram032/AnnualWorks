import { Icon, IStackTokens, Label, Stack, Toggle } from "@fluentui/react";
import React, { useContext, useEffect, useState } from "react";
import { PersonalizationContext } from "../../shared/providers/PersonalizationProvider";
import { ThemeNames, ThemeName } from '../../shared/consts/ThemeNames';

export const ThemeSwitch: React.FC = () => {
  const context = useContext(PersonalizationContext);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(
    context.themeName === ThemeNames.dark || 
    context.themeName === ThemeNames.darkHighContrast
  );
  const [isHighContrast, setIsHighContrast] = useState<boolean>(
    context.themeName === ThemeNames.lightHighContrast ||
    context.themeName === ThemeNames.darkHighContrast
  );

  const getThemeName = (): ThemeName => {
    if(isDarkTheme && isHighContrast) {
      return ThemeNames.darkHighContrast;
    }
    else if(!isDarkTheme && isHighContrast) {
      return ThemeNames.lightHighContrast;
    }
    else if(isDarkTheme && !isHighContrast) {
      return ThemeNames.dark;
    }
    else {
      return ThemeNames.light;
    }
  }

  const swtichTheme = () => setIsDarkTheme(!isDarkTheme);

  const switchContrast = () => setIsHighContrast(!isHighContrast);

  useEffect(() => {
    const themeName = getThemeName();
    context.switchTheme(themeName);
  }, [isDarkTheme, isHighContrast]);

  const stackTokens: IStackTokens = { childrenGap: 10 };

  return (
    <Stack tokens={stackTokens}>
      <Stack verticalAlign='center' tokens={stackTokens} horizontal>
        <Label>Motyw:</Label>
        <Icon className='theme-toggle-icon' iconName='Sunny'/>
        <Toggle className='theme-toggle' defaultChecked={isDarkTheme} onClick={swtichTheme} />
        <Icon className='theme-toggle-icon' iconName='ClearNight'/>
      </Stack>
      <Stack verticalAlign='center' tokens={stackTokens} horizontal>
        <Label>Wysoki kontrast:</Label>
        <Icon className='theme-toggle-icon' iconName='CircleRing'/>
        <Toggle className='theme-toggle' defaultChecked={isHighContrast} onClick={switchContrast} />
        <Icon className='theme-toggle-icon' iconName='Contrast'/>
      </Stack>
    </Stack>
    );
};

export default ThemeSwitch;
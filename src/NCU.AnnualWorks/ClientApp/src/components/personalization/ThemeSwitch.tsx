import { Icon, IStackTokens, Label, Stack, Toggle } from "@fluentui/react";
import React, { useContext, useEffect, useState } from "react";
import { PersonalizationContext } from "../../shared/providers/PersonalizationProvider";
import { ThemeName } from "../../themes/themes";

//TODO: Clean up

export const ThemeSwitch: React.FC = () => {
  const context = useContext(PersonalizationContext);
  
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(
    context.theme.name === 'darkTheme' || 
    context.theme.name === 'highContrastDarkTheme'
  );
  const [isHighContrast, setIsHighContrast] = useState<boolean>(
    context.theme.name === 'highContrastLightTheme' ||
    context.theme.name === 'highContrastDarkTheme'
  );

  const getThemeName = (): ThemeName => {
    if(isDarkTheme && isHighContrast) {
      return 'highContrastDarkTheme';
    }
    else if(!isDarkTheme && isHighContrast) {
      return 'highContrastLightTheme';
    }
    else if(isDarkTheme && !isHighContrast) {
      return 'darkTheme';
    }
    else {
      return 'lightTheme';
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
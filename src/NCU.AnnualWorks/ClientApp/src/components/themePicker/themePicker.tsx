import { Dropdown, FontSizes, Icon, IDropdownOption, IStackTokens, Label, mergeStyles, Stack, Toggle } from "@fluentui/react";
import React, { useContext, useEffect, useState } from "react";
import { PersonalizationContext } from "../../shared/providers/PersonalizationProvider";
import { ThemeNames, ThemeName } from '../../shared/consts/ThemeNames';

interface ThemePickerProps {
  useDropdown?: boolean;
}

export const ThemePicker: React.FC<ThemePickerProps> = (props) => {
  const context = useContext(PersonalizationContext);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(
    context.themeName === ThemeNames.dark || 
    context.themeName === ThemeNames.darkHighContrast
  );
  const [isHighContrast, setIsHighContrast] = useState<boolean>(
    context.themeName === ThemeNames.lightHighContrast ||
    context.themeName === ThemeNames.darkHighContrast
  );
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(context.themeName);
  const stackTokens: IStackTokens = { childrenGap: 10 };

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
  };

  useEffect(() => {
    const themeName = getThemeName();
    setCurrentTheme(themeName);
  }, [isDarkTheme, isHighContrast]);

  useEffect(() => {
    context.switchTheme(currentTheme);
  }, [currentTheme]);

  const dropdownOptions: IDropdownOption<ThemeName>[] = [
    {
      key: ThemeNames.light,
      text: 'Jasny motyw',
      data: ThemeNames.light
    },
    {
      key: ThemeNames.dark,
      text: 'Ciemny motyw',
      data: ThemeNames.dark
    },
    {
      key: ThemeNames.lightHighContrast,
      text: 'Jasny motyw (wysoki kontrast)',
      data: ThemeNames.lightHighContrast
    },
    {
      key: ThemeNames.darkHighContrast,
      text: 'Ciemny motyw (wysoki kontrast)',
      data: ThemeNames.darkHighContrast
    },
  ]  
  
  if(props.useDropdown)
  {
    return (
      <Dropdown
        dropdownWidth={'auto'}
        selectedKey={context.themeName}
        options={dropdownOptions}
        onChange={(event, item) => {
          const theme = item as IDropdownOption<ThemeName>;
          setCurrentTheme(theme.data!);
        }}
      />
    )
  }

  const iconStyles = mergeStyles({
    fontSize: FontSizes.size18
  });

  const toggleStyles = mergeStyles({
    margin: 0
  });

  return (
    <Stack tokens={stackTokens}>
      <Stack verticalAlign='center' tokens={stackTokens} horizontal>
        <Label>Motyw:</Label>
        <Icon className={iconStyles} iconName='Sunny'/>
        <Toggle 
          className={toggleStyles} 
          defaultChecked={isDarkTheme} 
          onClick={() => setIsDarkTheme(!isDarkTheme)} 
        />
        <Icon className={iconStyles} iconName='ClearNight'/>
      </Stack>
      <Stack verticalAlign='center' tokens={stackTokens} horizontal>
        <Label>Wysoki kontrast:</Label>
        <Icon className={iconStyles} iconName='CircleRing'/>
        <Toggle
          className={toggleStyles}
          defaultChecked={isHighContrast} 
          onClick={() => setIsHighContrast(!isHighContrast)} 
        />
        <Icon className={iconStyles} iconName='Contrast'/>
      </Stack>
    </Stack>
    );
};

export default ThemePicker;
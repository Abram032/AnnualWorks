import { Dropdown, FontSizes, Icon, IDropdownOption, IStackTokens, Label, mergeStyles, Stack, Toggle } from "@fluentui/react";
import React, { useContext, useEffect, useState } from "react";
import { PersonalizationContext } from "../shared/providers/PersonalizationProvider";
import { ThemeNames, ThemeName } from '../shared/Consts';
import { getThemeName } from '../themes/Themes';

interface ThemePickerProps {
  useDropdown?: boolean;
}

export const ThemePicker: React.FC<ThemePickerProps> = (props) => {
  const context = useContext(PersonalizationContext);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    context.themeName === ThemeNames.dark || 
    context.themeName === ThemeNames.darkHighContrast
  );
  const [isHighContrast, setIsHighContrast] = useState<boolean>(
    context.themeName === ThemeNames.lightHighContrast ||
    context.themeName === ThemeNames.darkHighContrast
  );
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(context.themeName);

  useEffect(() => {
    const themeName = getThemeName(isDarkMode, isHighContrast);
    setCurrentTheme(themeName);
  }, [isDarkMode, isHighContrast]);

  useEffect(() => {
    context.switchTheme(currentTheme);
  }, [currentTheme]);

  
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

  return (
    <Stack tokens={stackTokens}>
      <Stack verticalAlign='center' tokens={stackTokens} horizontal>
        <Label>Motyw:</Label>
        <Icon className={iconStyles} iconName='Sunny'/>
        <Toggle 
          className={toggleStyles} 
          defaultChecked={isDarkMode} 
          onClick={() => setIsDarkMode(!isDarkMode)} 
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


//#region Theme options

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
];

//#endregion


//#region Styles

const stackTokens: IStackTokens = { childrenGap: 10 };

const iconStyles = mergeStyles({
  fontSize: FontSizes.size18
});

const toggleStyles = mergeStyles({
  margin: 0
});

//#endregion
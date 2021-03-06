import { PartialTheme } from "@fluentui/react";
import { ThemeNames, ThemeName } from '../shared/Consts';

export const lightTheme: PartialTheme = {
  palette: {
    themePrimary: "#0074cc",
    themeLighterAlt: "#f3f9fd",
    themeLighter: "#cfe6f7",
    themeLight: "#a8d1f0",
    themeTertiary: "#5aa6e0",
    themeSecondary: "#1982d2",
    themeDarkAlt: "#0068b8",
    themeDark: "#00589b",
    themeDarker: "#004172",
    neutralLighterAlt: '"#f8f8f8"',
    neutralLighter: "#f4f4f4",
    neutralLight: "#eaeaea",
    neutralQuaternaryAlt: "#dadada",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c8c8",
    neutralTertiary: "#a19f9d",
    neutralSecondary: "#605e5c",
    neutralPrimaryAlt: "#3b3a39",
    neutralPrimary: "#323130",
    neutralDark: "#201f1e",
    black: "#000000",
    white: "#ffffff",
  },
};

export const darkTheme: PartialTheme = {
  palette: {
    themePrimary: "#0091ff",
    themeLighterAlt: "#00060a",
    themeLighter: "#001729",
    themeLight: "#002b4d",
    themeTertiary: "#005799",
    themeSecondary: "#007fe0",
    themeDarkAlt: "#199cff",
    themeDark: "#3dabff",
    themeDarker: "#70c1ff",
    neutralLighterAlt: "#2b2b2b",
    neutralLighter: "#333333",
    neutralLight: "#414141",
    neutralQuaternaryAlt: "#4a4a4a",
    neutralQuaternary: "#515151",
    neutralTertiaryAlt: "#6f6f6f",
    neutralTertiary: "#c8c8c8",
    neutralSecondary: "#d0d0d0",
    neutralPrimaryAlt: "#dadada",
    neutralPrimary: "#ffffff",
    neutralDark: "#f4f4f4",
    black: "#f8f8f8",
    white: "#222222",
  },
};

export const highContrastLightTheme: PartialTheme = {
  palette: {
    themePrimary: "#0000c8",
    themeLighterAlt: "#f3f3fd",
    themeLighter: "#cfcff6",
    themeLight: "#a7a7ee",
    themeTertiary: "#5959dd",
    themeSecondary: "#1919ce",
    themeDarkAlt: "#0000b3",
    themeDark: "#000097",
    themeDarker: "#00006f",
    neutralLighterAlt: "#faf9f8",
    neutralLighter: "#f3f2f1",
    neutralLight: "#edebe9",
    neutralQuaternaryAlt: "#e1dfdd",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c6c4",
    neutralTertiary: "#595959",
    neutralSecondary: "#373737",
    neutralPrimaryAlt: "#2f2f2f",
    neutralPrimary: "#000000",
    neutralDark: "#151515",
    black: "#0b0b0b",
    white: "#ffffff",
  },
};

export const highContrastDarkTheme: PartialTheme = {
  palette: {
    themePrimary: '#ffff00',
    themeLighterAlt: '#0a0a00',
    themeLighter: '#292900',
    themeLight: '#4d4d00',
    themeTertiary: '#999900',
    themeSecondary: '#e0e000',
    themeDarkAlt: '#ffff19',
    themeDark: '#ffff3d',
    themeDarker: '#ffff70',
    neutralLighterAlt: '#1c1c1c',
    neutralLighter: '#252525',
    neutralLight: '#343434',
    neutralQuaternaryAlt: '#3d3d3d',
    neutralQuaternary: '#454545',
    neutralTertiaryAlt: '#656565',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#111111'
  }
};

export const AvailableThemes = {
  [ThemeNames.light]: lightTheme,
  [ThemeNames.dark]: darkTheme,
  [ThemeNames.lightHighContrast]: highContrastLightTheme,
  [ThemeNames.darkHighContrast]: highContrastDarkTheme
};

export const getThemeName = (isDarkMode: boolean, isHighContrast: boolean): ThemeName => {
  if(isDarkMode && isHighContrast) {
    return ThemeNames.darkHighContrast;
  }
  else if(!isDarkMode && isHighContrast) {
    return ThemeNames.lightHighContrast;
  }
  else if(isDarkMode && !isHighContrast) {
    return ThemeNames.dark;
  }
  else {
    return ThemeNames.light;
  }
};
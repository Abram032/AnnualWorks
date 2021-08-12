import React from "react";
import { IStackTokens, Label, Link, mergeStyles, Stack } from "@fluentui/react";
import { AppSettings } from '../../AppSettings';
import { RouteNames } from '../../shared/consts/RouteNames';
import ThemePicker from "../themePicker/ThemePicker";

export const Footer: React.FC = () => {
  const stackTokens: IStackTokens = { childrenGap: 50 }

  const footerStyle = mergeStyles({
    margin: '1em'
  });

  const copyrightStyle = mergeStyles({
    alignSelf: 'center'
  });

  return (
    <Stack className={footerStyle} horizontalAlign='center' verticalAlign='center' horizontal tokens={stackTokens}>
      <Label className={copyrightStyle}>© {(new Date()).getFullYear()} {AppSettings.Copyright}</Label>
      <Link href={AppSettings.Urls.UMK}>UMK</Link>
      <Link href={AppSettings.Urls.USOS}>USOSWEB</Link>
      <Link href={AppSettings.Urls.InstituteOfPsychology}>Instytut Psychologii</Link>
      <Link href={RouteNames.privacy}>Prywatność</Link>
      <Link href={RouteNames.about}>O stronie</Link>
      <ThemePicker useDropdown/>
      {/* <LanguagePicker useDropdown/> */}
    </Stack>
  );
};

export default Footer;

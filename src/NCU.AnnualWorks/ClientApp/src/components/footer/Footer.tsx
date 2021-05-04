import { Label, Stack } from "@fluentui/react";
import React from "react";
import FooterContent from "./FooterContent";
import FooterLink from "./FooterLink";
import { AppSettings } from '../../AppSettings';
import { RouteNames } from '../../shared/consts/RouteNames';

export const Footer: React.FC = () => {
  return (
    //TODO: Add dropdown for language pick and theme pick
    <Stack className="footer" horizontal>
      <FooterContent>
        <Label className="footer-item copyright">© {(new Date).getFullYear()} {AppSettings.Copyright}</Label>
        <FooterLink href={AppSettings.Urls.UMK}>UMK</FooterLink>
        <FooterLink href={AppSettings.Urls.USOS}>USOSWEB</FooterLink>
        <FooterLink href={AppSettings.Urls.InstituteOfPsychology}>Instytut Psychologii</FooterLink>
        <FooterLink href={RouteNames.privacy}>Prywatność</FooterLink>
        <FooterLink href={RouteNames.about}>O stronie</FooterLink>
      </FooterContent>
    </Stack>
  );
};

export default Footer;

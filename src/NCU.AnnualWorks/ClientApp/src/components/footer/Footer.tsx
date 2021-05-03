import { Label, Stack } from "@fluentui/react";
import React from "react";
import FooterContent from "./FooterContent";
import FooterLink from "./FooterLink";

export const Footer: React.FC = () => {
  return (
    <Stack className="footer" horizontal>
      <FooterContent>
        <Label className="footer-item copyright">© 2021 Company Name</Label>
        <FooterLink href="https://www.umk.pl/">UMK</FooterLink>
        <FooterLink href="http://usosweb.umk.pl/">USOSWEB</FooterLink>
        <FooterLink href="http://psychologia.umk.pl/">Instytut Psychologii</FooterLink>
        <FooterLink href="/privacy">Prywatność</FooterLink>
        <FooterLink href="/about">O stronie</FooterLink>
      </FooterContent>
    </Stack>
  );
};

export default Footer;

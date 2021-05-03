import { Link } from "@fluentui/react";
import React from "react";

interface FooterLinkProps {
  children: React.ReactNode | string;
  href: string;
}

export const FooterLink: React.FC<FooterLinkProps> = (props) => (
  <Link className='footer-item footer-link' href={props.href}>{props.children}</Link>
);

export default FooterLink;
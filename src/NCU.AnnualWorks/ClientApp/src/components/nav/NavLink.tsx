import { Link, useTheme } from "@fluentui/react";
import React from "react";

interface NavLinkProps {
  label: string;
  href: string;
  onClick?: () => void;
}

export const NavLink: React.FC<NavLinkProps> = (props) => {
  const theme = useTheme();

  //#region Styles

  const styles = {
    root: [
      {
        color: theme.palette.neutralSecondary,
        selectors: {
          ":active": {
            color: theme.palette.black,
          },
          ":hover": {
            color: theme.palette.black,
          },
          ":active:hover": {
            color: theme.palette.black,
          },
          ":focus": {
            color: theme.palette.black,
          },
        },
      },
    ],
  };

  //#endregion

  return (
    <Link className="nav-link" styles={styles} href={props.href} onClick={props.onClick}>
      {props.label}
    </Link>
  );
};

export default NavLink;
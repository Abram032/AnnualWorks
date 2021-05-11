import { Link, useTheme } from "@fluentui/react";
import React from "react";

interface NavLinkProps {
  label: string;
  href: string;
}

export const NavLink: React.FC<NavLinkProps> = (props) => {
  const theme = useTheme();
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

  return (
    <Link className="nav-link" styles={styles} href={props.href}>
      {props.label}
    </Link>
  );
};

export default NavLink;
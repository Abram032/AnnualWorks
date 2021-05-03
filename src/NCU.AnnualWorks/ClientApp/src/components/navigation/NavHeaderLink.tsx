import { Link, useTheme } from "@fluentui/react";
import React from "react";

interface NavHeaderLinkProps {
  label: string;
  href: string;
}

export const NavHeaderLink: React.FC<NavHeaderLinkProps> = (props) => {
  const theme = useTheme();
  const styles = {
    root: [
      {
        color: theme.palette.neutralPrimary,
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
    <Link className="nav-header-link" styles={styles} href={props.href}>
      {props.label}
    </Link>
  );
};

export default NavHeaderLink;
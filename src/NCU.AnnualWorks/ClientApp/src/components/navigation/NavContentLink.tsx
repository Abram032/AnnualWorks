import { Link, useTheme } from "@fluentui/react";
import React from "react";

interface NavContentLinkProps {
  label: string;
  href: string;
}

export const NavContentLink: React.FC<NavContentLinkProps> = (props) => {
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
    <Link className="nav-content-link" styles={styles} href={props.href}>
      {props.label}
    </Link>
  );
};

export default NavContentLink;
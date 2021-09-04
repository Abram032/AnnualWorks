import { useTheme } from "@fluentui/react";
import React from "react";
import { Link } from '../../Components';

interface NavHeaderLinkProps {
  label: string;
  href: string;
  onClick?: () => void;
}

export const NavHeaderLink: React.FC<NavHeaderLinkProps> = (props) => {
  const theme = useTheme();

  //#region Styles

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

  //#endregion

  return (
    <Link className="nav-header-link" styles={styles} href={props.href} onClick={props.onClick}>
      {props.label}
    </Link>
  );
};

export default NavHeaderLink;
import React from "react";
import { Nav, INavLink, INavStyles, INavLinkGroup, useTheme } from "@fluentui/react";
import { useHistory } from "react-router";

interface AdminNavProps {
  selectedKey: string,
  groups: INavLinkGroup[]
}

export const AdminNav: React.FC<AdminNavProps> = (props) => {
  const history = useHistory();
  const theme = useTheme();

  function onClick(ev?: React.MouseEvent<HTMLElement>, item?: INavLink) {
    ev?.preventDefault();
    if (item) {
      history.push(item.url);
    }
  }

  //#region Styles
  const navStyles: Partial<INavStyles> = {
    root: {
      width: 250,
      height: 350,
      boxSizing: 'border-box',
      border: `1px solid ${theme.palette.neutralLight}`,
      overflowY: 'auto',
    },
  };
  //#endregion

  return (
    <Nav
      onLinkClick={onClick}
      selectedKey={props.selectedKey}
      ariaLabel="Admin navigation"
      styles={navStyles}
      groups={props.groups}
    />
  );
};

export default AdminNav;
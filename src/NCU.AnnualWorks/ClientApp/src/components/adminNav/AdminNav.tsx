import React from "react";
import Tile from "../../components/tile/tile";
import { Label, Stack, FontSizes, IStackTokens, Nav, INavLink, INavStyles, INavLinkGroup, useTheme } from "@fluentui/react";
import { RouteNames } from '../../shared/consts/RouteNames';
import { useHistory } from "react-router";

interface AdminNavProps {
  currentRoute: string,
}

export const AdminNav: React.FC<AdminNavProps> = (props) => {
  const history = useHistory();
  const theme = useTheme();

  function onClick(ev?: React.MouseEvent<HTMLElement>, item?: INavLink) {
    ev?.preventDefault();
    if(item) {
      history.push(item.url);
    }
  }

  const navStyles: Partial<INavStyles> = {
    root: {
      width: 250,
      height: 350,
      boxSizing: 'border-box',
      border: `1px solid ${theme.palette.neutralLight}`,
      overflowY: 'auto',
    },
  };

  const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: 'Administratorzy',
          url: RouteNames.adminPanelAdmins,
          key: RouteNames.adminPanelAdmins,
          icon: 'SecurityGroup'
        },
        {
          name: 'Pracownicy',
          url: RouteNames.adminPanelUsers,
          key: RouteNames.adminPanelUsers,
          icon: 'People'
        },
        {
          name: 'Termin końcowy',
          url: RouteNames.adminPanelDeadline,
          key: RouteNames.adminPanelDeadline,
          icon: 'CalendarSettings'
        },
        {
          name: 'Kurs',
          url: RouteNames.adminPanelCourse,
          key: RouteNames.adminPanelCourse,
          icon: 'Education'
        },
        {
          name: 'Eksport ocen',
          url: RouteNames.adminPanelExport,
          key: RouteNames.adminPanelExport,
          icon: 'Export',
        },
      ],
    },
  ];

  return (
    <Nav
      onLinkClick={onClick}
      selectedKey={props.currentRoute}
      ariaLabel="Nav basic example"
      styles={navStyles}
      groups={navLinkGroups}
    />
  );
};

export default AdminNav;
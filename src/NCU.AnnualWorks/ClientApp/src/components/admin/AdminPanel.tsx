import React from "react";
import { Loader, Tile } from '../../Components';
import { Stack, IStackTokens, IStackStyles, INavLinkGroup } from "@fluentui/react";
import AdminNav from './AdminNav';
import { RouteNames } from "../../shared/Consts";
import { Redirect, useHistory } from "react-router-dom";
import { useCurrentUser, useIsAuthenticated } from "../../shared/Hooks";

export const AdminPanel: React.FC = (props) => {
  const history = useHistory();
  const currentUser = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();

  if(isAuthenticated === null) {
    return <Loader />
  }

  if(!currentUser?.isAdmin) {
    return <Redirect to={RouteNames.forbidden} />
  }

  return (
    <Tile title='Panel administracyjny' padding='0'>
      <Stack horizontal>
        <AdminNav selectedKey={history.location.pathname} groups={groups} />
        <Stack styles={contentStyles} tokens={stackTokens}>
          {props.children}
        </Stack>
      </Stack>
    </Tile>
  );
};

export default AdminPanel;

//#region Nav Groups
const groups: INavLinkGroup[] = [
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
//#endregion

//#region Styles
const stackTokens: IStackTokens = { childrenGap: 15 };

const contentStyles: Partial<IStackStyles> = {
  root: {
    padding: '2em'
  }
};
//#endregion
import React from "react";
import Tile from "../../components/Tile";
import { Stack, IStackTokens, IStackStyles, INavLinkGroup } from "@fluentui/react";
import AdminNav from '../../components/AdminNav';
import { RouteNames } from "../../shared/consts/RouteNames";
import { useHistory } from "react-router-dom";

export const AdminPanel: React.FC = (props) => {
  const history = useHistory();

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
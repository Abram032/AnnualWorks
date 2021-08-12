import React from "react";
import Tile from "../../components/tile/Tile";
import { Stack, IStackTokens, IStackStyles } from "@fluentui/react";
import AdminNav from '../../components/adminNav/AdminNav';

interface AdminPanelProps {
  currentRoute: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const contentStyles: Partial<IStackStyles> = {
    root: {
      padding: '2em'
    }
  };

  const stackTokens: IStackTokens = { childrenGap: 15 };
  return (
    <Tile title='Panel administracyjny' padding='0'>
      <Stack horizontal>
        <AdminNav currentRoute={props.currentRoute}></AdminNav>
        <Stack styles={contentStyles} tokens={stackTokens}>
          {props.children}
        </Stack>
      </Stack>
    </Tile>
  );
};

export default AdminPanel;
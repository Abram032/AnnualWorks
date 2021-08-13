import React from "react";
import AdminPanel from './AdminPanel';
import { IStackTokens, Label, MessageBar, MessageBarType, PrimaryButton, StackItem } from "@fluentui/react";
import { useExportState, useCurrentTerm } from '../../shared/Hooks';
import { AppSettings } from "../../AppSettings";

export const AdminPanelExport: React.FC = () => {
  const term = useCurrentTerm();
  const thesesState = useExportState(term?.id);

  const warningMessageBar = (
    <MessageBar messageBarType={MessageBarType.severeWarning} isMultiline>
      Nie wszystkie prace posiadają ocenę końcową. 
      Skontaktuj się z promotorami oraz recenzentami, z prośbą o wystawienie pozostałych ocen.
      Inaczej lista ocen nie będzie pełna. 
    </MessageBar>
  );

  const tokens: IStackTokens = { childrenGap: 15 };
  
  return (
    <AdminPanel>
      {!thesesState ? warningMessageBar : null}
      <StackItem tokens={tokens}>
        <Label>Eksport ocen - {term?.names.pl}</Label>
        <PrimaryButton text="Pobierz" href={`${AppSettings.API.Export.Base}?termId=${term?.id}`} target='_blank' />
      </StackItem>
    </AdminPanel>
  );
};

export default AdminPanelExport;
import React from "react";
import { AdminPanel } from '../../Components';
import { IStackTokens, Label, MessageBar, MessageBarType, PrimaryButton, StackItem } from "@fluentui/react";
import { useExportValidation, useCurrentTerm } from '../../shared/Hooks';
import { AppSettings } from "../../AppSettings";
import { Loader } from "../../components/Index";
import { RouteNames } from "../../shared/Consts";
import { Redirect } from "react-router-dom";

export const AdminPanelExport: React.FC = () => {
  const [term, termFetching] = useCurrentTerm();
  const [isExportValid, exportValidationFetching] = useExportValidation(term?.id);

  if (termFetching || exportValidationFetching) {
    return <Loader />
  }

  if (isExportValid === undefined) {
    return <Redirect to={RouteNames.error} />
  }

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
      {!isExportValid ? warningMessageBar : null}
      <StackItem tokens={tokens}>
        <Label>Eksport ocen - {term?.names.pl}</Label>
        <PrimaryButton text="Pobierz" href={`${AppSettings.API.Export.Base}?termId=${term?.id}`} target='_blank' />
      </StackItem>
    </AdminPanel>
  );
};

export default AdminPanelExport;
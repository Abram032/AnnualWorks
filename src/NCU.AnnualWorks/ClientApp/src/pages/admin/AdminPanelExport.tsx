import React, { useState } from "react";
import { IStackTokens, Label, MessageBar, MessageBarType, PrimaryButton, Stack, StackItem, Dropdown, IDropdownOption } from "@fluentui/react";
import { useExportValidation, useCurrentTerm, useExportTerms } from '../../shared/Hooks';
import { AppSettings } from "../../AppSettings";
import { Loader,  } from "../../Components";
import { RouteNames } from "../../shared/Consts";
import { Redirect } from "react-router-dom";

export const AdminPanelExport: React.FC = () => {
  const [currentTerm, currentTermFetching] = useCurrentTerm();
  const [exportTerms, exportTermsFetching] = useExportTerms();
  const [isExportValid, exportValidationFetching] = useExportValidation(currentTerm?.id);
  const [selectedTerm, setSelectedTerm] = useState<IDropdownOption>();

  if (currentTermFetching || exportValidationFetching || exportTermsFetching) {
    return <Loader />
  }

  if (isExportValid === undefined || !currentTerm || !exportTerms) {
    return <Redirect to={RouteNames.error} />
  }

  //#region Messages

  const warningMessageBar = (
    <MessageBar messageBarType={MessageBarType.severeWarning} isMultiline>
      Nie wszystkie prace posiadają ocenę końcową.
      Skontaktuj się z promotorami oraz recenzentami, z prośbą o wystawienie pozostałych ocen.
      Inaczej lista ocen nie będzie pełna.
    </MessageBar>
  );

  //#endregion

  return (
    <Stack tokens={tokens}>
      {!isExportValid ? warningMessageBar : null}
      <StackItem tokens={tokens}>
        <Label>Eksport ocen</Label>
        <Dropdown
          title="Semestr"
          selectedKey={selectedTerm ? selectedTerm.key : undefined}
          options={exportTerms.map(t => ({ key: t.id, text: t.names.pl }))}
          defaultSelectedKey={currentTerm.id}
          onChange={(e, item) => setSelectedTerm(item)}
          required
        />
      </StackItem>
      <StackItem tokens={tokens}>
        <PrimaryButton text="Pobierz" href={`${AppSettings.API.Export.Base}?termId=${selectedTerm?.key}`} target='_blank' />
      </StackItem>
    </Stack>
  );
};

export default AdminPanelExport;

//#region Styles

const tokens: IStackTokens = { childrenGap: 15 };

//#endregion
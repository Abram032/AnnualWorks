import React, { useEffect, useState } from "react";
import { IStackTokens, MessageBar, MessageBarType, PrimaryButton, StackItem } from '@fluentui/react';
import { useCurrentTerm } from '../../shared/Hooks';
import { useDeadline } from '../../shared/Hooks'; 
import { DatePicker, AdminPanel } from '../../Components';
import { SetDeadlineRequestData, useApi } from "../../shared/api/Api";
import { AppSettings } from "../../AppSettings";

export const AdminPanelDeadline: React.FC = () => {
  const [date, setDate] = useState<Date>();
  const term = useCurrentTerm();
  const deadline = useDeadline();
  const api = useApi();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [success, setIsSuccess] = useState<boolean>();
  
  const onSelect = (date: Date | null | undefined) => {
    if(date) {
      setDate(date);
    }
  }

  useEffect(() => {
    setDate(deadline);
  }, [deadline]);

  const save = () => {
    setIsSuccess(false);
    setErrorMessage(undefined);
    if(!date) {
      setErrorMessage("Wybierz datę, aby zapisać nowy termin końcowy.");
      return;
    }
    const request: SetDeadlineRequestData = {
      deadline: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
    api.put(AppSettings.API.Deadline.Base, request)
    .then(res => {
      setIsSuccess(true);
    })
    .catch(err => {
      setIsSuccess(false);
      setErrorMessage(err.data);
    })
  }

  const warningMessageBar = (
    <MessageBar messageBarType={MessageBarType.warning}>
      Zmiana terminu końcowego może uniemożliwić niektórym użytkownikom dodanie nowych prac.
    </MessageBar>
  );

  const errorMessageBar = (
    <MessageBar messageBarType={MessageBarType.error}>
      {errorMessage}
    </MessageBar>
  )

  const successMessageBar = (
    <MessageBar messageBarType={MessageBarType.success}>
      Nowy termin końcowy został ustawiony.
    </MessageBar>
  );

  const tokens: IStackTokens = { childrenGap: 15 };

  return (
    <AdminPanel>
      {warningMessageBar}
      {success ? successMessageBar : null}
      {errorMessage ? errorMessageBar : null}
      <StackItem tokens={tokens }>
        <DatePicker 
          label="Wybierz termin końcowy"
          placeholder="Wybierz..."
          aria-placeholder="Wybierz datę..."
          value={date}
          onSelectDate={onSelect}
          minDate={term?.startDate}
          maxDate={term?.endDate}
        />
        <PrimaryButton text="Zatwierdź" onClick={save} />
      </StackItem>
    </AdminPanel>
  );
};

export default AdminPanelDeadline;
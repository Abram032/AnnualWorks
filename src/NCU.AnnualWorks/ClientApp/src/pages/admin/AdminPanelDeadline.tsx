import React, { useState } from "react";
import { IStackTokens, MessageBar, MessageBarType, PrimaryButton, Stack, StackItem } from '@fluentui/react';
import { useCurrentTerm, useCurrentYear, useDeadline } from '../../shared/Hooks';
import { DatePicker, Loader } from '../../Components';
import { SetDeadlineRequestData, Api } from "../../shared/api/Api";
import { AppSettings } from "../../AppSettings";
import { Redirect } from "react-router-dom";
import { RouteNames } from "../../shared/Consts";
import { useForm } from "react-hook-form";
import { scrollToTop } from "../../shared/Utils";

interface Form {
  deadline: Date,
}

export const AdminPanelDeadline: React.FC = () => {
  const [deadline, deadlineFetching] = useDeadline();
  const [term, termFetching] = useCurrentYear();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const { handleSubmit, control, setValue } = useForm<Form>({
    reValidateMode: "onSubmit",
    mode: "all",
  });

  if(termFetching || deadlineFetching) {
    return <Loader />
  }

  if(!term || !deadline) {
    return <Redirect to={RouteNames.error} />
  }

  const onSave = () => {
    setUploadSuccess(false);
    setErrorMessage(undefined);

    handleSubmit(
      (values) => {
        const request: SetDeadlineRequestData = {
          deadline: `${values.deadline.getFullYear()}-${values.deadline.getMonth() + 1}-${values.deadline.getDate()}`
        }
        Api.put(AppSettings.API.Deadline.Base, request)
          .then(res => {
            scrollToTop();
            setUploadSuccess(true);
          })
          .catch(err => {
            scrollToTop();
            setUploadSuccess(false);
            setErrorMessage(err.data ?? err.message);
          })
      },
      (err) => {
        setErrorMessage("Popraw błędy walidacyjne zanim ustawisz nowy termin końcowy.");
      }
    )();
  };

  //#region Messages

  const warningMessageBar = 
    <MessageBar messageBarType={MessageBarType.warning}>
      Zmiana terminu końcowego może uniemożliwić niektórym użytkownikom dodanie nowych prac.
    </MessageBar>
  const errorMessageBar = <MessageBar messageBarType={MessageBarType.error}>{errorMessage}</MessageBar>
  const successMessageBar = <MessageBar messageBarType={MessageBarType.success}>Nowy termin końcowy został ustawiony.</MessageBar>

  //#endregion

  return (
    <Stack tokens={tokens}>
      {warningMessageBar}
      {uploadSuccess ? successMessageBar : null}
      {errorMessage ? errorMessageBar : null}
      <StackItem tokens={tokens}>
        <DatePicker
          control={control}
          name="deadline"
          label="Wybierz termin końcowy"
          value={deadline}
          minDate={term.startDate}
          maxDate={term.endDate}
          rules={{
            required: "Termin końcowy jest wymagany",
            validate: (value: Date) => {
              if(!value) {
                return "Wybierz datę, aby zapisać nowy termin końcowy.";
              }
              else if (value > term.endDate) {
                return "Termin końcowy nie może przekraczać daty końca roku akademickiego.";
              }
              else if (value < term.startDate) {
                return "Termin końcowy nie może być wcześniejszy data startu roku akademickiego.";
              }
            }
          }}
          required
        />
      </StackItem>
      <StackItem tokens={tokens}>
        <PrimaryButton text="Zatwierdź" onClick={onSave} />
      </StackItem>
    </Stack>
  );
};

export default AdminPanelDeadline;

//#region Styles

const tokens: IStackTokens = { childrenGap: 15 };

//#endregion
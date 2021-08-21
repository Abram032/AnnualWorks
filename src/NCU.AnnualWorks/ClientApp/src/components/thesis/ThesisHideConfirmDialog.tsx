import { DefaultButton, Dialog, DialogFooter, DialogType, MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { AppSettings } from '../../AppSettings';
import { Api } from '../../shared/api/Api';
import { RouteNames } from '../../shared/Consts';

interface ThesisHideConfirmDialogProps {
  guid: string,
  isThesisHidden: boolean,
  isVisible: boolean,
  toggleIsVisible: () => void
}

export const ThesisHideConfirmDialog: React.FC<ThesisHideConfirmDialogProps> = (props) => {
  const history = useHistory();

  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const labelId: string = useId('ThesisHideConfirmDialogLabelId');
  const subTextId: string = useId('ThesisHideConfirmDialogSubTextId');
  const dialogContentProps = {
    type: DialogType.normal,
    title: props.isThesisHidden ? 'Odkryj pracę' : 'Ukryj pracę',
    closeButtonAriaLabel: 'Close'
  };
  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
    }),
    [labelId, subTextId],
  );

  const onSave = () => {
    setErrorMessage(undefined);
    setUploadSuccess(false);

    const uri = props.isThesisHidden ? AppSettings.API.Theses.Unhide : AppSettings.API.Theses.Hide;

    Api.post(`${uri}/${props.guid}`)
      .then(res => {
        setUploadSuccess(true);
        props.toggleIsVisible();
        history.push(RouteNames.root);
      })
      .catch(err => {
        setErrorMessage(err.data ?? err.message);
        setUploadSuccess(false);
      })
  };

  //#region Messages

  const errorMessageBar = (
    <MessageBar messageBarType={MessageBarType.error}>
      {errorMessage}
    </MessageBar>
  );

  const successMessageBar = (
    <MessageBar messageBarType={MessageBarType.success}>
      Praca została ukryta.
    </MessageBar>
  );

  const unhideMessageBar = (
    <MessageBar messageBarType={MessageBarType.severeWarning}>  
      Odkrycie pracy spowoduje, że będzie ona widoczna dla innych użytkowników. Pozwoli to również na eksport oceny z pracy, gdy zostanie wystawiona.
    </MessageBar>
  );

  const hideMessageBar = (
    <MessageBar messageBarType={MessageBarType.severeWarning}>  
      Ukrycie pracy spowoduje, że nie będzie ona widoczna dla innych użytkowników.
      Ukryte prace są widoczne tylko dla administratorów systemu.
      Uwaga! Może uniemożliwić to również zrecenzowanie pracy oraz wystawienie oceny.
      Dodatkowo oceny z ukrytych prac nie są eksportowane.
    </MessageBar>
  );

  //#endregion Messages

  return (
    <Dialog
      hidden={!props.isVisible}
      onDismiss={props.toggleIsVisible}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    >
      {errorMessage ? errorMessageBar : null}
      {uploadSuccess ? successMessageBar : null}
      {props.isThesisHidden ? unhideMessageBar : hideMessageBar}
      <DialogFooter>
        <PrimaryButton onClick={onSave} text={props.isThesisHidden ? "Odkryj" : "Ukryj"} />
        <DefaultButton onClick={props.toggleIsVisible} text="Anuluj" />
      </DialogFooter>
    </Dialog>
  );
}
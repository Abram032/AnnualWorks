import { DefaultButton, Dialog, DialogFooter, DialogType, MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { AppSettings } from '../../AppSettings';
import { Api } from '../../shared/api/Api';
import { RouteNames } from '../../shared/Consts';

interface ThesisCancelGradeDialogProps {
  guid: string,
  isVisible: boolean,
  toggleIsVisible: () => void
}

export const ThesisCancelGradeDialog: React.FC<ThesisCancelGradeDialogProps> = (props) => {
  const history = useHistory();

  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const labelId: string = useId('ThesisCancelDialogLabelId');
  const subTextId: string = useId('ThesisCancelDialogSubTextId');
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Anuluj zatwierdzenie oceny',
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

    Api.post(`${AppSettings.API.Theses.Grade.Cancel}/${props.guid}`)
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
      Ocena została anulowana, poinformuj promotora o potrzebie ponownego wystawienia oceny.
    </MessageBar>
  );

  const warningMessageBar = (
    <MessageBar messageBarType={MessageBarType.severeWarning}>  
      Anulowanie oceny spowoduje, że będzie musiała ona ponownie zostać wyznaczona przez promotora pracy.
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
      {warningMessageBar}
      <DialogFooter>
        <PrimaryButton onClick={onSave} text={"Anuluj ocenę"} />
        <DefaultButton onClick={props.toggleIsVisible} text="Zamknij" />
      </DialogFooter>
    </Dialog>
  );
}
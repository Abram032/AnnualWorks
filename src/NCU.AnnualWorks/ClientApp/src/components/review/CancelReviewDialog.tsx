import { DefaultButton, Dialog, DialogFooter, DialogType, MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { AppSettings } from '../../AppSettings';
import { Api } from '../../shared/api/Api';
import { RouteNames } from '../../shared/Consts';

interface CancelReviewDialogProps {
  guid: string,
  isVisible: boolean,
  toggleIsVisible: () => void
}

export const CancelReviewDialog: React.FC<CancelReviewDialogProps> = (props) => {
  const history = useHistory();

  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const labelId: string = useId('CancelReviewDialogLabelId');
  const subTextId: string = useId('CancelReviewDialogSubTextId');
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Anuluj zatwierdzenie recenzji',
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

    Api.post(`${AppSettings.API.Reviews.Cancel}/${props.guid}`)
      .then(res => {
        setUploadSuccess(true);
        props.toggleIsVisible();
        history.push(history.location.pathname);
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
      Recenzja została anulowana, poinformuj promotora o potrzebie ponownego wystawienia recenzji.
    </MessageBar>
  );

  const warningMessageBar = (
    <MessageBar messageBarType={MessageBarType.severeWarning}>  
      Anulowanie recenzji spowoduje, że będzie musiała ona ponownie zostać zatwierdzona przez promotora pracy. Jeżeli praca posiada już ocenę, zostanie ona również anulowana.
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
        <PrimaryButton onClick={onSave} text={"Anuluj recenzję"} />
        <DefaultButton onClick={props.toggleIsVisible} text="Zamknij" />
      </DialogFooter>
    </Dialog>
  );
}
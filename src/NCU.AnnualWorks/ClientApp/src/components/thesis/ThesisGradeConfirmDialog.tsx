import { DefaultButton, Dialog, DialogFooter, DialogType, MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { AppSettings } from '../../AppSettings';
import { ConfirmGradeRequestData, useApi } from '../../shared/api/Api';
import { RouteNames } from '../../shared/Consts';
import { Dropdown } from '../../Components';
import { Grade, GradeList } from '../../shared/Models';
import { mapGradesToDropdownOptions } from '../../shared/Utils';

interface Form {
  grade: Grade
}

interface ThesisGradeConfirmDialogProps {
  guid: string,
  isVisible: boolean,
  toggleIsVisible: () => void
}

export const ThesisGradeConfirmDialog: React.FC<ThesisGradeConfirmDialogProps> = (props) => {
  const api = useApi();
  const history = useHistory();

  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const labelId: string = useId('ThesisGradeConfirmDialogLabelId');
  const subTextId: string = useId('ThesisGradeConfirmDialogSubTextId');
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Wystaw ocenę',
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

  const { handleSubmit, control } = useForm<Form>({
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const onSave = () => {
    handleSubmit(
      (values) => {
        var body: ConfirmGradeRequestData = {
          grade: values.grade
        };
        api.post(`${AppSettings.API.Theses.Grade}/${props.guid}`, body)
          .then(res => {
            setUploadSuccess(true);
            props.toggleIsVisible();
            history.push(RouteNames.detailsPath(props.guid));
          })
          .catch(err => {
            setErrorMessage(err.data);
          })
      },
      (err) => {
        console.log(err);
      }
    )();
  };

  const errorMessageBar = (
    <MessageBar messageBarType={MessageBarType.error}>
      {errorMessage}
    </MessageBar>
  );

  const successMessageBar = (
    <MessageBar messageBarType={MessageBarType.success}>
      Ocena została wystawiona
    </MessageBar>
  );

  return (
    <Dialog
      hidden={props.isVisible}
      onDismiss={props.toggleIsVisible}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    >
      {errorMessage ? errorMessageBar : null}
      {uploadSuccess ? successMessageBar : null}
      <MessageBar messageBarType={MessageBarType.severeWarning}>
        Po wystawieniu oceny nie ma możliwości jej zmiany.
      </MessageBar>
      <Dropdown
        control={control}
        name='grade'
        label='Ocena'
        rules={{
          required: "Ocena jest wymagana."
        }}
        placeholder='Wybierz ocenę'
        options={mapGradesToDropdownOptions(GradeList)}
        required
      />
      <DialogFooter>
        <PrimaryButton onClick={onSave} text="Zatwierdź" />
        <DefaultButton onClick={props.toggleIsVisible} text="Anuluj" />
      </DialogFooter>
    </Dialog>
  );
}

export default ThesisGradeConfirmDialog;
import { DefaultButton, Dialog, DialogFooter, DialogType, IDropdownOption, MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { AppSettings } from '../../AppSettings';
import { ConfirmGradeRequestData, useApi } from '../../shared/api/Api';
import { RouteNames } from '../../shared/consts/RouteNames';
import { ControlledDropdown } from '../dropdown/controlledDropdown';

interface Form {
  grade: string
}

interface ThesisGradeConfirmDialogProps {
  guid: string,
  isVisible: boolean,
  setIsVisible: () => void
}

export const ThesisGradeConfirmDialog: React.FC<ThesisGradeConfirmDialogProps> = (props) => {
  const api = useApi();
  const history = useHistory();

  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const labelId: string = useId('confirmDialogLabelId');
  const subTextId: string = useId('confirmDialogSubtextId');
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

  const gradeValues = ['2', '3', '3.5', '4', '4.5', '5'];
  const grades: IDropdownOption[] = gradeValues.map<IDropdownOption>(g => ({ key: g, text: g }));

  const onSave = () => {
    handleSubmit(
      (values) => {
        var body: ConfirmGradeRequestData = {
          grade: values.grade
        };
        api.post(`${AppSettings.API.Theses.Grade}/${props.guid}`, body)
        .then(res => {
          setUploadSuccess(true);
          props.setIsVisible();
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
      onDismiss={props.setIsVisible}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    >
      {errorMessage ? errorMessageBar : null}
      {uploadSuccess ? successMessageBar : null}
      <MessageBar messageBarType={MessageBarType.severeWarning}>
        Po wystawieniu oceny nie ma możliwości jej zmiany.
      </MessageBar>
      <ControlledDropdown
        control={control}
        name='grade'
        label='Ocena'
        rules={{
          required: "Ocena jest wymagana."
        }}
        placeholder='Wybierz ocenę'
        options={grades}
        required
      />
      <DialogFooter>
        <PrimaryButton onClick={onSave} text="Zatwierdź" />
        <DefaultButton onClick={props.setIsVisible} text="Anuluj" />
      </DialogFooter>
    </Dialog>
  );
}

export default ThesisGradeConfirmDialog;
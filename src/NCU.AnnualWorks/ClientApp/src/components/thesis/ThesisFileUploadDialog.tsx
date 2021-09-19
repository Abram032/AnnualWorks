import { DefaultButton, Dialog, DialogFooter, DialogType, MessageBar, MessageBarType, PrimaryButton } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { AppSettings } from '../../AppSettings';
import { Api } from '../../shared/api/Api';
import { RouteNames } from '../../shared/Consts';
import { FilePicker } from '../../Components';
import { FilePickerOptions } from '../../shared/Models';
import { fileRules } from './ThesisFileUploadDialogValidationRules';

interface Form {
  files: FileList
}

interface ThesisFileUploadDialogProps {
  guid: string,
  isVisible: boolean,
  options: FilePickerOptions,
  toggleIsVisible: () => void
}

export const ThesisFileUploadDialog: React.FC<ThesisFileUploadDialogProps> = (props) => {
  const history = useHistory();
  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [files, setFiles] = useState<FileList | null>();

  const labelId: string = useId('ThesisFileUploadDialogLabelId');
  const subTextId: string = useId('ThesisFileUploadDialogSubTextId');
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Dodaj dodatkowe pliki do pracy',
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
    setErrorMessage(undefined);
    setUploadSuccess(false);

    handleSubmit(
      (values) => {
        const formData = new FormData();
        for(var i = 0; i < values.files.length; i++) {
          const file = values.files.item(i);
          const blob = file as Blob;
          formData.append("files", blob, file?.name)
        }

        Api.post(`${AppSettings.API.Files.Thesis}/${props.guid}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
            setUploadSuccess(true);
            props.toggleIsVisible();
            history.push(RouteNames.detailsPath(props.guid));
          })
          .catch(err => {
            setErrorMessage(err.data ?? err.message);
            setUploadSuccess(false);
          })
      },
      (err) => {
        setErrorMessage("Popraw błędy walidacyjne przed dodaniem plików.");
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
      Pliki zostały dodane
    </MessageBar>
  );

  return (
    <Dialog
      hidden={!props.isVisible}
      onDismiss={props.toggleIsVisible}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
      minWidth={500}
    >
      {errorMessage ? errorMessageBar : null}
      {uploadSuccess ? successMessageBar : null}

      <FilePicker
        id="files"
        name="files"
        label="Dodaj pliki"
        required={true}
        control={control}
        value={files}
        onChange={(f) => setFiles(f)}
        options={props.options}
        rules={fileRules(props?.options)}
        multiple
      />

      <DialogFooter>
        <PrimaryButton onClick={onSave} text="Zapisz" />
        <DefaultButton onClick={props.toggleIsVisible} text="Anuluj" />
      </DialogFooter>
    </Dialog>
  );
}

export default ThesisFileUploadDialog;
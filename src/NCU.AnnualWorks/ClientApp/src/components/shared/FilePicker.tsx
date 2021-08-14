import {
  ActionButton,
  FontSizes,
  IconButton,
  IStackTokens,
  Label,
  mergeStyles,
  PrimaryButton,
  Stack,
  StackItem,
  TextField,
  useTheme
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { FilePickerOptions, HookFormProps } from '../../shared/Models';
import { Controller } from "react-hook-form";

interface FilePickerProps {
  id: string;
  name: string;
  required: boolean;
  value?: FileList | null;
  label?: string;
  icon?: string;
  iconOnly?: boolean;
  multiple?: boolean;
  options?: FilePickerOptions;
  onChange: (fileList: FileList | null) => void;
  onBlur?: () => void;
  errorMessage?: string | JSX.Element;
}

export const FilePicker: React.FC<HookFormProps<FileList> & FilePickerProps> = (props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={props.rules}
      defaultValue={props.defaultValue}
      render={({
        field: { onChange, onBlur, name: fieldName, value },
        fieldState: { error }
      }) => (
        <CustomFilePickerWrapper
          {...props}
          name={fieldName}
          onChange={(fileList) => onChange(fileList)}
          onBlur={onBlur}
          value={value}
          errorMessage={error && error.message}
        />
      )}
    />
  );
};

export default FilePicker;

//#region Custom file picker implementation

const CustomFilePickerWrapper: React.FC<FilePickerProps> = (props) => {
  const theme = useTheme();

  //#region Styles

  const stackTokens: IStackTokens = { childrenGap: 15 };

  const validationErrorStyles = mergeStyles({
    color: theme.semanticColors.errorText,
    fontSize: FontSizes.size12,
    marginTop: '5px'
  });

  //#endregion

  return (
    <>
      <Label required={props.required}>{props.label}</Label>
      <Stack horizontal tokens={stackTokens}>
        <StackItem>
          <CustomFilePicker
            {...props}
          />
        </StackItem>
        <StackItem grow={2}>
          <TextField
            value={
              props.value ? props.value[0]?.name : "Nie wybrano żadnego pliku"
            }
            readOnly
          />
        </StackItem>
      </Stack>
      {props.errorMessage ? <span className={validationErrorStyles}>{props.errorMessage}</span> : null}
    </>
  );
};

const CustomFilePicker: React.FC<FilePickerProps> = (props) => {
  const [inputElement, setInputElement] = useState<HTMLElement | null>(null);

  //Set input element after first render
  useEffect(() => {
    setInputElement(document.getElementById(props.id));
  }, [props.id]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    const files = event.currentTarget.files;
    //Invoke onChange for higher component
    props.onChange(files);
  };

  //Hidden input component that handles files
  //Custom component is rendered instead of default
  const hiddenInputButton = (
    <input
      id={props.id}
      type='file'
      name={props.name}
      accept={props.options?.allowedExtensions?.join(',') ?? '*'}
      multiple={props.multiple ?? false}
      aria-label="File picker"
      onChange={onChange}
      style={{ display: 'none' }}
      hidden
    />
  );

  //Actual input buttons rendered instead of default which is hidden
  //Rendered depending on passed properties
  const button = (
    <>
      {hiddenInputButton}
      <PrimaryButton
        label='Wybierz plik'
        text={props.label ?? "Wybierz plik"}
        onClick={() => inputElement?.click()}
      />
    </>
  )

  const iconButton = (
    <>
      {hiddenInputButton}
      <ActionButton
        iconProps={{ iconName: `${props.icon ?? 'Upload'}` }}
        label='Wybierz plik'
        text={props.label ?? "Wybierz plik"}
        onClick={() => inputElement?.click()}
      />
    </>
  )

  const iconOnlyButton = (
    <>
      {hiddenInputButton}
      <IconButton
        iconProps={{ iconName: `${props.icon ?? 'Upload'}` }}
        label='Wybierz plik'
        onClick={() => inputElement?.click()}
      />
    </>
  )

  return !props.icon ? button : !props.iconOnly ? iconButton : iconOnlyButton;
}

//#endregion
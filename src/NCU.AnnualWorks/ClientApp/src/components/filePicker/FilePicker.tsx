import { ActionButton, IconButton, PrimaryButton, TextField } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import FilePickerOptions from './FilePickerOptions';

interface FilePickerProps {
  id: string;
  label?: string;
  icon?: string;
  iconOnly?: boolean;
  multiple?: boolean;
  options?: FilePickerOptions;
  onChange: (fileList: FileList | null) => void;
}

export const FilePicker: React.FC<FilePickerProps> = (props) => {
  const [inputElement, setInputElement] = useState<HTMLElement | null>(null);
  
  //Set input element after first render
  useEffect(() => {
    setInputElement(document.getElementById(props.id));
  }, []);

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
      name={props.id}
      accept={props.options?.allowedExtensions?.join(',') ?? '*'}
      multiple={props.multiple ?? false}
      aria-label="File picker"
      onChange={onChange}
      style={{display: 'none'}}
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

export default FilePicker;
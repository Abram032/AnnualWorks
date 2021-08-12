import React from "react";
import { Controller } from "react-hook-form";
import { StandardFilePicker, FilePickerProps } from "./filePicker"
import { HookFormProps } from "../../shared/components/models/HookFormProps";

export const ControlledFilePicker: React.FC<HookFormProps<FileList> & FilePickerProps> = (props) => {
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
        <StandardFilePicker
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

export default ControlledFilePicker;
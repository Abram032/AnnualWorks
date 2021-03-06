import React from "react";
import { Controller } from "react-hook-form";
import { ITextFieldProps, TextField as FluentTextField } from "@fluentui/react";
import { HookFormProps } from "../../shared/Models";

export const TextField: React.FC<HookFormProps<string> & ITextFieldProps> = (props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={props.rules}
      defaultValue={props.defaultValue || ""}
      render={({
        field: { onChange, onBlur, name: fieldName, value },
        fieldState: { error }
      }) => (
        <FluentTextField
          {...props}
          onChange={onChange}
          value={value}
          onBlur={onBlur}
          name={fieldName}
          errorMessage={error && error.message}
          defaultValue={""}
        />
      )}
    />
  );
};

export default TextField;
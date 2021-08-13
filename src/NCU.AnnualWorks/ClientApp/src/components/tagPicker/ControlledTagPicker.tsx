import React from "react";
import { Controller } from "react-hook-form";
import { TagPicker, TagPickerProps } from "./TagPicker"
import { HookFormProps } from "../../shared/Models";
import { ITag } from "@fluentui/react";

export const ControlledTagPicker: React.FC<HookFormProps<ITag[]> & TagPickerProps> = (props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={props.rules}
      defaultValue={props.defaultValue || []}
      render={({
        field: { onChange, onBlur, name: fieldName, value },
        fieldState: { error }
      }) => (
        <TagPicker
          {...props}
          name={fieldName}
          onChange={(tags) => onChange(tags)}
          onBlur={onBlur}
          selectedTags={value}
          errorMessage={error && error.message}
          defaultValue={props.defaultValue}
        />
      )}
    />
  );
};

export default ControlledTagPicker;
import React from "react";
import { Controller } from "react-hook-form";
import { PeoplePicker, PeoplePickerProps } from "./PeoplePicker"
import { HookFormProps } from "../../shared/components/models/HookFormProps";
import { IPersonaProps } from "@fluentui/react";

export const ControlledTagPicker: React.FC<HookFormProps<IPersonaProps[]> & PeoplePickerProps> = (props) => {
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
        <PeoplePicker
          {...props}
          name={fieldName}
          onChange={(people) => onChange(people)}
          onBlur={onBlur}
          selectedPeople={value}
          errorMessage={error && error.message}
          defaultValue={props.defaultValue}
        />
      )}
    />
  );
};

export default ControlledTagPicker;
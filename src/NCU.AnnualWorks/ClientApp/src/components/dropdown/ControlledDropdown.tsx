import React from "react";
import { Controller } from "react-hook-form";
import { Dropdown, IDropdownProps } from "@fluentui/react";
import { HookFormProps } from "../../shared/Models";

export const ControlledDropdown: React.FC<HookFormProps<string> & IDropdownProps> = (props) => {
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
        <Dropdown
          {...props}
          onChange={(e, option) => {
            onChange(option?.key);
          }}
          selectedKey={value}
          onBlur={onBlur}
          key={fieldName}
          errorMessage={error && error.message}
        />
      )}
    />
  );
};

export default ControlledDropdown;
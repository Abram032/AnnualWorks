import React from "react";
import { Controller } from "react-hook-form";
import { FontSizes, Label, mergeStyles, Checkbox as FluentCheckbox, useTheme, ICheckboxProps } from "@fluentui/react";
import { HookFormProps } from "../../shared/Models";

interface CheckboxProps {
  value: boolean
  name?: string,
  errorMessage?: string | undefined,
  required?: boolean,
}

export const Checkbox: React.FC<HookFormProps<boolean> & CheckboxProps & ICheckboxProps> = (props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={props.rules}
      defaultValue={props.defaultValue || false}
      render={({
        field: { onChange, onBlur, name: fieldName, value },
        fieldState: { error }
      }) => (
        <CheckboxWrapper
          {...props}
          onChange={onChange}
          checked={props.checked}
          name={fieldName}
          errorMessage={error && error.message}
          value={value}
        />
      )}
    />
  );
};

export default Checkbox;

//#region CheckboxWrapper

export const CheckboxWrapper: React.FC<CheckboxProps & ICheckboxProps> = (props) => {
  //#region Styles

  const theme = useTheme();
  const validationErrorStyles = mergeStyles({
    color: theme.semanticColors.errorText,
    fontSize: FontSizes.size12,
    marginTop: '5px'
  });

  //#endregion

  return (
    <>
      <Label required={props.required}>{props.label}</Label>
      <FluentCheckbox
        {...props}
        checked={props.value}
      />
      {props.errorMessage ? <span className={validationErrorStyles}>{props.errorMessage}</span> : null}
    </>
  )
}

//#endregion
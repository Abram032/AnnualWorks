import React from "react";
import { Controller } from "react-hook-form";
import { FontSizes, ISpinButtonProps, Label, mergeStyles, SpinButton as FluentSpinButton, useTheme } from "@fluentui/react";
import { HookFormProps } from "../../shared/Models";

interface SpinButtonProps {
  name?: string,
  errorMessage?: string | undefined,
  required?: boolean,
}

export const SpinButton: React.FC<HookFormProps<string> & SpinButtonProps & ISpinButtonProps> = (props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={props.rules}
      defaultValue={props.defaultValue || "0"}
      render={({
        field: { onChange, onBlur, name: fieldName, value },
        fieldState: { error }
      }) => (
        <SpinButtonWrapper
          {...props}
          onChange={onChange}
          onIncrement={(value) => onChange(`${parseInt(value) + 1}`)}
          onDecrement={(value) => onChange(`${parseInt(value) - 1}`)}
          value={value}
          onBlur={onBlur}
          name={fieldName}
          errorMessage={error && error.message}
          defaultValue={"0"}
        />
      )}
    />
  );
};

export default SpinButton;

//#region SpinButtonWrapper

export const SpinButtonWrapper: React.FC<SpinButtonProps & ISpinButtonProps> = (props) => {
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
      <FluentSpinButton
        {...props}
      />
      {props.errorMessage ? <span className={validationErrorStyles}>{props.errorMessage}</span> : null}
    </>
  )
}

//#endregion
import React from "react";
import { DatePicker as FluentDatePicker, DayOfWeek, FontSizes, IDatePickerProps, IDatePickerStrings, mergeStyles, useTheme } from "@fluentui/react";
import { HookFormProps } from "../../shared/Models";
import { Controller } from "react-hook-form";
import { useState } from "react";

interface DatePickerProps {
  name: string;
  label: string;
  value: Date;
  onSelectDate?: (date?: Date | null) => void;
  onBlur?: () => void;
  required?: boolean;
  errorMessage?: string | JSX.Element;
  defaultValue?: Date,
  minDate?: Date,
  maxDate?: Date,
}

export const DatePicker: React.FC<HookFormProps<IDatePickerProps> & DatePickerProps> = (props) => {
  const [date, setDate] = useState<Date>(props.value);

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
        <DatePickerWrapper
          {...props}
          onSelectDate={(date) => {
            if(date) {
              onChange(date);
              setDate(date);
            }
          }}
          value={date}
          onBlur={onBlur}
          key={fieldName}
          errorMessage={error && error.message}
        />
      )}
    />
  );
};

//#region DatePickerWrapper

export const DatePickerWrapper: React.FC<DatePickerProps> = (props) => {

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
      <FluentDatePicker
        {...props}
        isRequired={props.required}
        key={props.name}
        firstDayOfWeek={DayOfWeek.Monday}
        formatDate={(date) => date ? date.toLocaleDateString() : ""}
        strings={strings}
        defaultValue={props.defaultValue?.toLocaleDateString()}
        placeholder="Wybierz..."
        aria-placeholder="Wybierz datę..."
      />
      {props.errorMessage ? <span className={validationErrorStyles}>{props.errorMessage}</span> : null}
    </>
  )
}

//#endregion

//#region Strings

const strings: IDatePickerStrings = {
  days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Sobota"],
  shortDays: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"],
  months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
  shortMonths: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
  goToToday: "Idź do dzisiaj",
};

//#endregion
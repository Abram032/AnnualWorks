import React from "react";
import { DatePicker as FluentDatePicker, DayOfWeek, IDatePickerProps, IDatePickerStrings } from "@fluentui/react";

export const DatePicker: React.FC<IDatePickerProps> = (props) => {
  return (
    <FluentDatePicker
      {...props}
      firstDayOfWeek={DayOfWeek.Monday}
      formatDate={(date) => date ? date.toLocaleDateString() : ""}
      strings={strings}
    />
  );
};

export default DatePicker;


//#region Strings
const strings: IDatePickerStrings = {
  days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Sobota"],
  shortDays: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"],
  months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
  shortMonths: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
  goToToday: "Idź do dzisiaj",
};
//#endregion
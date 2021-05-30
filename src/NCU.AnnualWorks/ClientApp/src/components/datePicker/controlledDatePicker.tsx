import React from "react";
import { DatePicker, DayOfWeek, IDatePickerProps, IDatePickerStrings } from "@fluentui/react";

export const ControlledDatePicker: React.FC<IDatePickerProps> = (props) => {
  const strings: IDatePickerStrings = {
    days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Sobota"],
    shortDays: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"],
    months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
    shortMonths: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
    goToToday: "Idź do dzisiaj",
  };

  return (
    <DatePicker 
      {...props}
      firstDayOfWeek={DayOfWeek.Monday} 
      placeholder="Wybierz końcowy termin" 
      ariaLabel="Wybierz końcowy termin"
      formatDate={(date) => date ? date.toLocaleDateString() : ""}
      strings={strings}
    />
  );
};

export default ControlledDatePicker;
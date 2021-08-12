import { RegisterOptions } from "react-hook-form";

export const answerRules = (isRequired: boolean): RegisterOptions => {  
  const validators: RegisterOptions = {
    validate: (value: string) => {
      if (value.length > 2500) {
        return "Maksymalna liczba znaków wynosi 2500.";
      }
    }
  };
  if(isRequired) {
    validators.required = "Odpowiedź jest wymagana";
  }
  
  return validators;
};

export const notRequiredAnswerRules: RegisterOptions = {
  validate: (value: string) => {
    if (value.length > 2500) {
      return "Maksymalna liczba znaków wynosi 2500.";
    }
  }
};

export const gradeRules: RegisterOptions = {
  required: "Ocena jest wymagana."
};
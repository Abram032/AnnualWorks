import { RegisterOptions } from "react-hook-form";

export const requiredAnswerRules: RegisterOptions = {
  required: "Odpowiedź jest wymagana.",
  validate: (value: string) => {
    if (value.length > 2500) {
      return "Maksymalna liczba znaków wynosi 2500.";
    }
  }
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
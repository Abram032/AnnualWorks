import { RegisterOptions } from "react-hook-form";

export const answerRules: RegisterOptions = {
  required: "Odpowiedź jest wymagana.",
  validate: (value: string) => {
    if (value.length > 2000) {
      return "Maksymalna liczba znaków wynosi 2000.";
    }
  }
};

export const gradeRules: RegisterOptions = {
  required: "Ocena jest wymagana."
};
import { IPersonaProps, ITag } from "@fluentui/react";
import { RegisterOptions } from "react-hook-form";
import FilePickerOptions from "../filePicker/filePickerOptions";
import mime from "mime-types";

export const titleRules: RegisterOptions = {
  required: "Tytuł jest wymagany.",
  validate: (value: string) => {
    if (value.length > 1000) {
      return "Maksymalna liczba znaków wynosi 1000.";
    }
  }
};

export const authorRules: RegisterOptions = {
  validate: (value: IPersonaProps[]) => {
    if (value.length === 0) {
      return "Wymagany jest co najmniej 1 autor.";
    }
    if (value.length > 2) {
      return "Maksymalna liczba autorów to 2.";
    }
    return true;
  },
};

export const abstractRules: RegisterOptions = {
  required: "Abstrakt jest wymagany.",
  validate: (value: string) => {
    if (value.length > 4000) {
      return "Maksymalna liczba znaków wynosi 4000.";
    }
  },
};

export const tagsRules: RegisterOptions = {
  validate: (value: ITag[]) => {
    if (value.length === 0) {
      return "Wymagane jest co najmniej 1 słowo kluczowe.";
    }
    if (value.some((p) => p.name.length === 0)) {
      return "Słowo kluczowe nie może być puste.";
    }
    if (value.some((p) => p.name.length > 255)) {
      return "Maksymalna długość słowa kluczowego to 255 znaków.";
    }
    if (value.length > 10) {
      return "Maksymalna liczba słów kluczowych to 10.";
    }
    return true;
  },
};

export const reviewerRules: RegisterOptions = {
  validate: (value: IPersonaProps[]) => {
    if (value.length === 0) {
      return "Recenzent jest wymagany.";
    }
    if (value.length > 1) {
      return "Maksymalna liczba recenzentów wynosi 1.";
    }
    return true;
  },
};

export const fileRules = (options?: FilePickerOptions): RegisterOptions => {
  return {
    required: "Plik z pracą jest wymagany",
    validate: (value: FileList) => {
      if (value.length === 0) {
        return "Plik z pracą jest wymagany.";
      }
      if (value.length > 1) {
        return "Maksymalna liczba plików wynosi 1.";
      }
      if (value[0].name.length > 255) {
        return "Maksymalna długość nazwy pliku to 255 znaków.";
      }
      if (options?.maxSize && value[0].size > options.maxSize) {
        return `Rozmiar pliku jest zbyt duży. Maksymalny rozmiar pliku to ${options.maxSize / 1000 / 1000}MB`;
      }
      const extension = mime.extension(value[0].type);
      if (!extension) {
        return "Nieznany format pliku.";
      }
      if (extension !== "pdf") {
        return "Nieprawidłowy format pliku. Dozwolone formaty: '.pdf";
      }
      return true;
    },
  };
}
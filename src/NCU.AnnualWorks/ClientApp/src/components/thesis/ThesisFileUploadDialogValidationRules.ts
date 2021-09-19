import { RegisterOptions } from "react-hook-form";
import { FilePickerOptions } from "../../shared/Models";

export const fileRules = (options?: FilePickerOptions): RegisterOptions => {
  return {
    required: "Plik jest wymagany",
    validate: (value: FileList) => {
      const fileArray = Array.from(value);
      if (value.length === 0) {
        return "Wymagane jest dodanie przynajmniej jednego pliku.";
      }
      if (value.length > 10) {
        return "Maksymalna liczba plików wynosi 10.";
      }
      if (fileArray.some(v => v.name.length > 255)) {
        return "Maksymalna długość nazwy pliku to 255 znaków.";
      }
      if (options?.maxSize && fileArray.some(v => v.size > options.maxSize!)) {
        return `Rozmiar pliku jest zbyt duży. Maksymalny rozmiar pliku to ${options.maxSize / 1000 / 1000}MB`;
      }
      if(options?.allowedExtensions && fileArray.some(v => !options?.allowedExtensions!.includes(`.${v.name.split('.').pop()}` || ""))) {
        return `Nieprawidłowy format pliku. Dozwolone formaty: ${options.allowedExtensions.join(', ')}`;
      }
      return true;
    },
  };
}
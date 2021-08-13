import { Control, RegisterOptions, UseFormSetValue } from "react-hook-form";

export interface HookFormProps<T> {
  control: Control<any>;
  name: string;
  rules?: RegisterOptions;
  defaultValue?: T;
  setValue?: UseFormSetValue<any>;
};

export default HookFormProps;
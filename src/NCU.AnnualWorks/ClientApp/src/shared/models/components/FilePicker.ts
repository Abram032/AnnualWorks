export type FilePickerOptions = {
  allowedExtensions?: string[],
  maxSize?: number,
  maxFileCount?: number
};

export const filePickerDefaultOptions: FilePickerOptions = {
  allowedExtensions: [".pdf"],
  maxFileCount: 1,
  maxSize: 10000000
};
export interface FileActions {
  canDownload: boolean,
  canDelete: boolean,
}

export type File = {
  guid: string,
  fileName: string,
  extension: string,
  contentType: string,
  size: number,
  actions: FileActions | null,
};

export default File;
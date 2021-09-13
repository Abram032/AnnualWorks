import { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { useIsAuthenticated } from './AuthHooks';
import { File } from '../Models';

export const useThesisFiles = (guid: string): [File[] | undefined, boolean] => {
  const [files, setFiles] = useState<File[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated === null) {
      return;
    }

    if (!isAuthenticated) {
      setIsFetching(false);
      return;
    }

    if (guid) {
      Api.get<File[]>(`${AppSettings.API.Files.Thesis}/${guid}`)
        .then(response => {
          setFiles(response.data);
          setIsFetching(false);
        })
        .catch(error => {
          console.error(error);
          setIsFetching(false);
        });
    }
  }, [guid, isAuthenticated]);

  return [files, isFetching];
};
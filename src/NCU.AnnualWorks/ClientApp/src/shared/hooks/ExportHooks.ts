import { useEffect, useState } from 'react';
import { useApi } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { useIsAuthenticated } from './AuthHooks';

export const useExportValidation = (termId: string | undefined): [boolean | undefined, boolean] => {
  const api = useApi();
  const [valid, setValid] = useState<boolean>();
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

    if (termId) {
      api.get<boolean>(`${AppSettings.API.Export.State}?termId=${termId}`)
        .then(response => {
          setValid(response.data);
          setIsFetching(false);
        })
        .catch(error => {
          console.error(error);
          setIsFetching(false);
        });
    }
  }, [termId, isAuthenticated]);

  return [valid, isFetching];
};
import { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { useIsAuthenticated } from './AuthHooks';

export const useExportValidation = (termId: string | undefined): [boolean | undefined, boolean] => {
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
      Api.get<boolean>(`${AppSettings.API.Export.Validate}?termId=${termId}`)
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
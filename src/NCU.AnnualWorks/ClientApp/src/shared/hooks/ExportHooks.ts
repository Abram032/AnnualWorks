import { useEffect, useState, useContext } from 'react';
import { useApi } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

export const useExportState = (termId: string | undefined): boolean | undefined => {
  const api = useApi();
  const [valid, setValid] = useState<boolean>();
  const authContext = useContext(AuthenticationContext);

  useEffect(() => {
    if (!authContext.isAuthenticated) {
      return;
    }

    if (termId) {
      api.get<boolean>(`${AppSettings.API.Export.State}?termId=${termId}`)
        .then(response => {
          setValid(response.data);
        })
        .catch(error => {
          //console.error(error);
        });
    }
  }, [termId, authContext.isAuthenticated]);

  return valid;
};
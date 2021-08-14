import { useEffect, useState, useContext } from 'react';
import { useApi } from '../api/Api';
import { Term } from '../Models';
import { AppSettings } from '../../AppSettings';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

export const useCurrentTerm = (): Term | undefined => {
  const api = useApi();
  const [term, setTerm] = useState<Term>();
  const authContext = useContext(AuthenticationContext);

  useEffect(() => {
    if (!authContext.isAuthenticated) {
      return;
    }

    api.get<Term>(AppSettings.API.Terms.Current)
      .then(response => {
        setTerm({
          id: response.data.id,
          names: {
            pl: response.data.names.pl,
            en: response.data.names.en
          },
          startDate: new Date(response.data.startDate),
          endDate: new Date(response.data.endDate),
          finishDate: new Date(response.data.finishDate)
        });
      })
      .catch(error => {
        console.error(error);
      });
  }, [authContext.isAuthenticated]);

  return term;
};
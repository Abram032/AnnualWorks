import { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { Term } from '../Models';
import { AppSettings } from '../../AppSettings';
import { useIsAuthenticated } from './AuthHooks';

export const useCurrentTerm = (): [Term | undefined, boolean] => {
  const [term, setTerm] = useState<Term>();
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

    Api.get<Term>(AppSettings.API.Terms.Current)
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
        setIsFetching(false);
      })
      .catch(error => {
        console.error(error);
        setIsFetching(false);
      });
  }, [isAuthenticated]);

  return [term, isFetching];
};
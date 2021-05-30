import { useEffect, useState } from 'react';
import { useApi } from '../api/Api';
import Term from '../models/Term';
import { AppSettings } from '../../AppSettings';

export const useCurrentTerm = (): Term | undefined => {
  const api = useApi();
  const [term, setTerm] = useState<Term>();

  useEffect(() => {
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
  }, []);

  return term;
};
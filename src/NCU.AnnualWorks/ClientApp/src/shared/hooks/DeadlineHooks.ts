import { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { useIsAuthenticated } from './AuthHooks';

export const useDeadline = (): [Date | undefined, boolean] => {
  const [date, setDate] = useState<Date>();
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

    Api.get<Date>(AppSettings.API.Deadline.Base)
      .then(response => {
        setDate(new Date(response.data));
        setIsFetching(false);
      })
      .catch(error => {
        console.error(error);
        setIsFetching(false);
      });
  }, [isAuthenticated]);

  return [date, isFetching];
};
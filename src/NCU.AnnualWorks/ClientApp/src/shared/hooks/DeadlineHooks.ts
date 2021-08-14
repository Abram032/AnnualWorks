import { useContext, useEffect, useState } from 'react';
import { useApi } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

export const useDeadline = (): Date | undefined => {
  const api = useApi();
  const [date, setDate] = useState<Date>();
  const authContext = useContext(AuthenticationContext);

  useEffect(() => {
    if (!authContext.isAuthenticated) {
      return;
    }

    api.get<Date>(AppSettings.API.Deadline.Base)
      .then(response => {
        setDate(new Date(response.data));
      })
      .catch(error => {
        //console.error(error);
      });
  }, [authContext.isAuthenticated]);

  return date;
};
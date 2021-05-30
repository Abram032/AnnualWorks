import { useEffect, useState } from 'react';
import { useApi } from '../api/Api';
import { AppSettings } from '../../AppSettings';

export const useDeadline = (): Date | undefined => {
  const api = useApi();
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    api.get<Date>(AppSettings.API.Deadline.Base)
      .then(response => {
        setDate(new Date(response.data));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return date;
};
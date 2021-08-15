import { useEffect, useState } from 'react';
import { useApi } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { Question } from '../Models';
import { useIsAuthenticated } from './AuthHooks';

export const useActiveQuestions = (): [Question[], boolean] => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const isAuthenticated = useIsAuthenticated();
  const api = useApi();

  useEffect(() => {
    if (isAuthenticated === null) {
      return;
    }

    if (!isAuthenticated) {
      setIsFetching(false);
      return;
    }

    api.get<Question[]>(AppSettings.API.Questions.Active)
      .then(response => {
        setQuestions(response.data);
        setIsFetching(false);
      })
      .catch(error => {
        console.error(error);
        setIsFetching(false);
      });
  }, [isAuthenticated]);

  return [questions, isFetching];
};
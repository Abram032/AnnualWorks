import { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { Question } from '../Models';
import { useIsAuthenticated } from './AuthHooks';

export const useActiveQuestions = (): [Question[], boolean] => {
  const [questions, setQuestions] = useState<Question[]>([]);
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

    Api.get<Question[]>(AppSettings.API.Questions.Active)
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

export const useQuestions = (): [Question[], boolean] => {
  const [questions, setQuestions] = useState<Question[]>([]);
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

    Api.get<Question[]>(AppSettings.API.Questions.Base)
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
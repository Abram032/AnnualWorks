import { useEffect, useState, useContext } from 'react';
import { useApi } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { Question } from '../models/Review';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

export const useActiveQuestions = (): Question[] => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const api = useApi();
  const authContext = useContext(AuthenticationContext);

  useEffect(() => {
    if(!authContext.isAuthenticated) {
      return;
    }

    api.get<Question[]>(AppSettings.API.Questions.Active)
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [authContext.isAuthenticated]);

  return questions;
};
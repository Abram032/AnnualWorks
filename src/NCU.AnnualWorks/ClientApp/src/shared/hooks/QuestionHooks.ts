import { useEffect, useState } from 'react';
import { useApi } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { Question } from '../models/Review';

export const useActiveQuestions = (): Question[] => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const api = useApi();

  useEffect(() => {
    api.get<Question[]>(AppSettings.API.Questions.Active)
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return questions;
};
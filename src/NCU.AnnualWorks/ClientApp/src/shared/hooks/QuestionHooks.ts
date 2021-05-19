import { useEffect, useState } from 'react';
import Api from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { Question } from '../models/Review';

export const useActiveQuestions = (): Question[] => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    Api.get<Question[]>(AppSettings.API.Questions.Active)
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return questions;
};
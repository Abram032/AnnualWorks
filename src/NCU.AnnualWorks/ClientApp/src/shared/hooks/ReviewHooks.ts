import { useEffect, useState } from 'react';
import { ThesisRequestData, useApi } from '../api/Api';
import Thesis from '../models/Thesis';
import { AppSettings } from '../../AppSettings';
import Review from '../models/Review';

export const useReview = (guid: string): [Review | undefined, boolean] => {
  const api = useApi();
  const [review, setReview] = useState<Review>();
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    setIsFetching(true);
    api.get<Review>(`${AppSettings.API.Reviews.Base}/${guid}`)
      .then(response => {
        setReview(response.data);
        setIsFetching(false);
      })
      .catch(error => {
        console.error(error);
        setIsFetching(false)
      });
  }, []);

  return [review, isFetching];
};
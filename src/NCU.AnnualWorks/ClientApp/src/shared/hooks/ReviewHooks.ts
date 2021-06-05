import { useEffect, useState, useContext } from 'react';
import { useApi } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import Review from '../models/Review';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

export const useReview = (guid: string): [Review | undefined, boolean] => {
  const api = useApi();
  const [review, setReview] = useState<Review>();
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const authContext = useContext(AuthenticationContext);

  useEffect(() => {
    if(!authContext.isAuthenticated) {
      setIsFetching(false);
      return;
    }

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
  }, [authContext.isAuthenticated]);

  return [review, isFetching];
};
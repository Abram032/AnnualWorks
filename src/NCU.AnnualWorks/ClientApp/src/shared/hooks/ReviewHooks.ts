import { useEffect, useState } from 'react';
import { useApi } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { Review } from '../Models';
import { useIsAuthenticated } from './AuthHooks';

export const useReview = (guid: string): [Review | undefined, boolean] => {
  const api = useApi();
  const [review, setReview] = useState<Review>();
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
  }, [isAuthenticated]);

  return [review, isFetching];
};
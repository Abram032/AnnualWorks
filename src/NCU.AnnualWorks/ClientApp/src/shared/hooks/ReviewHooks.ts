import { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { Review } from '../Models';
import { useIsAuthenticated } from './AuthHooks';

export const useReview = (guid: string): [Review | undefined, boolean] => {
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
    Api.get<Review>(`${AppSettings.API.Reviews.Base}/${guid}`)
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

export const useValidateQuestions = (guid: String): [boolean | undefined, boolean] => {
  const [isValid, setIsValid] = useState<boolean>();
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
    Api.get<boolean>(`${AppSettings.API.Reviews.ValidateQuestions}/${guid}`)
      .then(response => {
        setIsValid(response.data);
        setIsFetching(false);
      })
      .catch(error => {
        console.error(error);
        setIsFetching(false)
      });
  }, [isAuthenticated]);

  return [isValid, isFetching];
}
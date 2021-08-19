import { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { Thesis } from '../Models';
import { AppSettings } from '../../AppSettings';
import { useCurrentUser, useIsAuthenticated } from './AuthHooks';

export const useThesis = (guid: string): [Thesis | undefined, boolean] => {
  const [thesis, setThesis] = useState<Thesis>();
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (isAuthenticated === null) {
      return;
    }

    if (!isAuthenticated) {
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    Api.get<Thesis>(`${AppSettings.API.Theses.Base}/${guid}`)
      .then(response => {
        setThesis(response.data);
        setIsFetching(false);
      })
      .catch(error => {
        console.error(error);
        setIsFetching(false)
      });
  }, [isAuthenticated, currentUser]);

  return [thesis, isFetching];
};

const useTheses = (endpoint: string, verifyEmployee?: boolean): [Thesis[], boolean] => {
  const [thesis, setThesis] = useState<Thesis[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (isAuthenticated === null) {
      return;
    }

    if (!isAuthenticated || (verifyEmployee && !currentUser?.isEmployee)) {
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    Api.get<Thesis[]>(endpoint)
      .then(response => {
        setThesis(response.data);
        setIsFetching(false);
      })
      .catch(error => {
        console.error(error);
        setIsFetching(false)
      });
  }, [isAuthenticated, currentUser]);

  return [thesis, isFetching];
};

export const useCurrentTheses = (): [Thesis[], boolean] => useTheses(AppSettings.API.Theses.Base);
export const usePromotedTheses = (): [Thesis[], boolean] => useTheses(AppSettings.API.Theses.Promoted, true);
export const useReviewedTheses = (): [Thesis[], boolean] => useTheses(AppSettings.API.Theses.Reviewed, true);
export const useAuthoredTheses = (): [Thesis[], boolean] => useTheses(AppSettings.API.Theses.Authored);
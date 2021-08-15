import { useEffect, useState } from 'react';
import { useApi } from '../api/Api';
import { Thesis } from '../Models';
import { AppSettings } from '../../AppSettings';
import { useIsAuthenticated } from './AuthHooks';

export const useThesis = (guid: string): [Thesis | undefined, boolean] => {
  const [thesis, setThesis] = useState<Thesis>();
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

    setIsFetching(true);
    api.get<Thesis>(`${AppSettings.API.Theses.Base}/${guid}`)
      .then(response => {
        setThesis(response.data);
        setIsFetching(false);
      })
      .catch(error => {
        console.error(error);
        setIsFetching(false)
      });
  }, [isAuthenticated]);

  return [thesis, isFetching];
};

const useTheses = (endpoint: string): [Thesis[], boolean] => {
  const [thesis, setThesis] = useState<Thesis[]>([]);
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

    setIsFetching(true);
    api.get<Thesis[]>(endpoint)
      .then(response => {
        setThesis(response.data);
        setIsFetching(false);
      })
      .catch(error => {
        console.error(error);
        setIsFetching(false)
      });
  }, [isAuthenticated]);

  return [thesis, isFetching];
};

export const useCurrentTheses = (): [Thesis[], boolean] => useTheses(AppSettings.API.Theses.Base);
export const usePromotedTheses = (): [Thesis[], boolean] => useTheses(AppSettings.API.Theses.Promoted);
export const useReviewedTheses = (): [Thesis[], boolean] => useTheses(AppSettings.API.Theses.Reviewed);
export const useAuthoredTheses = (): [Thesis[], boolean] => useTheses(AppSettings.API.Theses.Authored);
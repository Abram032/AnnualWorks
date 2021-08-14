import { useEffect, useState, useContext } from 'react';
import { useApi } from '../api/Api';
import { Thesis } from '../Models';
import { AppSettings } from '../../AppSettings';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

export const useThesis = (guid: string): [Thesis | undefined, boolean] => {
  const [thesis, setThesis] = useState<Thesis>();
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const api = useApi();
  const authContext = useContext(AuthenticationContext);

  useEffect(() => {
    if (!authContext.isAuthenticated) {
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
  }, [authContext.isAuthenticated]);

  return [thesis, isFetching];
};

const useTheses = (endpoint: string): [Thesis[], boolean] => {
  const [thesis, setThesis] = useState<Thesis[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const api = useApi();
  const authContext = useContext(AuthenticationContext);

  useEffect(() => {
    if (!authContext.isAuthenticated) {
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
  }, []);

  return [thesis, isFetching];
};

export const useCurrentTheses = (): [Thesis[], boolean] => useTheses(AppSettings.API.Theses.Base);
export const usePromotedTheses = (): [Thesis[], boolean] => useTheses(AppSettings.API.Theses.Promoted);
export const useReviewedTheses = (): [Thesis[], boolean] => useTheses(AppSettings.API.Theses.Reviewed);
export const useAuthoredTheses = (): [Thesis[], boolean] => useTheses(AppSettings.API.Theses.Authored);
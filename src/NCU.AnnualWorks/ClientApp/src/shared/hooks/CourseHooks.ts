import { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { Course } from '../Models';
import { useIsAuthenticated } from './AuthHooks';

export const useCourse = (): [Course | undefined, boolean] => {
  const [course, setCourse] = useState<Course>();
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

    Api.get<Course>(AppSettings.API.Course.Base)
      .then(response => {
        setCourse(response.data);
        setIsFetching(false);
      })
      .catch(error => {
        console.error(error);
        setIsFetching(false);
      });
  }, [isAuthenticated]);

  return [course, isFetching];
};
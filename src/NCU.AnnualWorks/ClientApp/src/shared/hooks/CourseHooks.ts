import { useEffect, useState, useContext } from 'react';
import { useApi } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { Course } from '../Models';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

export const useCourse = (): Course | undefined => {
  const api = useApi();
  const [course, setCourse] = useState<Course>();
  const authContext = useContext(AuthenticationContext);

  useEffect(() => {
    if (!authContext.isAuthenticated) {
      return;
    }

    api.get<Course>(AppSettings.API.Course.Base)
      .then(response => {
        setCourse(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [authContext.isAuthenticated]);

  return course;
};
import { useEffect, useState } from 'react';
import { useApi } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { Course } from '../models/Course';

export const useCourse = (): Course | undefined => {
  const api = useApi();
  const [course, setCourse] = useState<Course>();

  useEffect(() => {
    api.get<Course>(AppSettings.API.Course.Base)
      .then(response => {
        setCourse(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return course;
};
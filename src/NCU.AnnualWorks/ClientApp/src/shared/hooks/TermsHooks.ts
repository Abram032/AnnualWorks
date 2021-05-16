import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import Api from '../api/Api';
import Keyword from '../models/Keyword';
import { AppSettings } from '../../AppSettings';

export const useCurrentTerm = (): Keyword[] => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  useEffect(() => {
    Api.get<Keyword[]>(AppSettings.API.Keywords.Base)
      .then(response => {
        setKeywords(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return keywords
};
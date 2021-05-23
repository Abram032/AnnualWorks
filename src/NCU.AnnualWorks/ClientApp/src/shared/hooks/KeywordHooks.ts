import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useApi } from '../api/Api';
import Keyword from '../models/Keyword';
import { AppSettings } from '../../AppSettings';
import { ITag } from '@fluentui/react';

export const useKeywords = (): Keyword[] => {
  const api = useApi();
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  useEffect(() => {
    api.get<Keyword[]>(AppSettings.API.Keywords.Base)
      .then(response => {
        setKeywords(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return keywords
};

export const useTagPicker = (keywords: Keyword[]): [ITag[], ITag[], (tags?: ITag[]) => void] => {

  const [tags, setTags] = useState<ITag[]>([]);
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);

  useEffect(() => {
    setTags(keywords.map<ITag>(k => ({ key: k.id, name: k.text })));
  }, [keywords]);

  const onChange = (tags?: ITag[]) => {
    if(tags) {
      setSelectedTags(tags);
    }
  };

  return [tags, selectedTags, onChange]
};
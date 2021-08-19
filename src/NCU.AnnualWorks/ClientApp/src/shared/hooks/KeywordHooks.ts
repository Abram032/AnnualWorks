import { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { Keyword } from '../Models';
import { AppSettings } from '../../AppSettings';
import { ITag } from '@fluentui/react';
import { useIsAuthenticated } from './AuthHooks';
import { mapKeywordsToTags } from '../Utils';

export const useKeywords = (): [Keyword[], boolean] => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
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

    Api.get<Keyword[]>(AppSettings.API.Keywords.Base)
      .then(response => {
        setKeywords(response.data);
        setIsFetching(false);
      })
      .catch(error => {
        console.error(error);
        setIsFetching(false);
      });
  }, [isAuthenticated]);

  return [keywords, isFetching];
};

export const useTagPicker = (keywords: Keyword[]): [ITag[], ITag[], (tags?: ITag[]) => void] => {

  const [tags, setTags] = useState<ITag[]>([]);
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);

  useEffect(() => {
    setTags(mapKeywordsToTags(keywords));
  }, [keywords]);

  const onChange = (tags?: ITag[]) => {
    if (tags) {
      setSelectedTags(tags);
    }
  };

  return [tags, selectedTags, onChange]
};
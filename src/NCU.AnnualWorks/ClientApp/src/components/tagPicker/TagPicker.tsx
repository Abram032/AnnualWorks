import React, { useState } from 'react';
import { ITag, TagPicker as FluentTagPicker } from '@fluentui/react';

interface TagPickerProps {
  tagList: ITag[];
  separator?: string;
}

export const TagPicker: React.FC<TagPickerProps> = (props) => {
  const [tags] = useState<ITag[]>(props.tagList);

  const onFilterChanged = (
    filter: string,
    selectedItems?: ITag[]
  ): ITag[] | Promise<ITag[]> => {
    if(filter.endsWith(props.separator ?? ' ')) {
      const value = filter.slice(0, filter.length - 1);
      const tag: ITag = {
        key: value,
        name: value
      }
      //Ensure uniquness
      return !tags.includes(tag) ? [tag] : [];
    }

    return tags.filter(t => !selectedItems?.includes(t));
  }

  const onEmptyFilter = (
    selectedItems?: ITag[]
  ): ITag[] | Promise<ITag[]> => {

    return tags.filter(t => !selectedItems?.includes(t));
  }

  return (
    <FluentTagPicker 
      onEmptyResolveSuggestions={onEmptyFilter}
      onResolveSuggestions={onFilterChanged}
    />
  )
}

export default TagPicker;
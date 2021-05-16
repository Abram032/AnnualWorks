import React, { useState } from 'react';
import { ITag, TagPicker as FluentTagPicker } from '@fluentui/react';

interface TagPickerProps {
  tags: ITag[];
  selectedTags: ITag[];
  onChange: (tags?: ITag[]) => void;
  separator?: string;
}

export const TagPicker: React.FC<TagPickerProps> = (props) => {
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
      return !props.tags.includes(tag) ? [tag] : [];
    }

    return props.tags.filter(t => !selectedItems?.includes(t));
  }

  const onEmptyFilter = (
    selectedItems?: ITag[]
  ): ITag[] | Promise<ITag[]> => {
    return props.tags.filter(t => !selectedItems?.includes(t));
  }

  return (
    <FluentTagPicker 
      onEmptyResolveSuggestions={onEmptyFilter}
      onResolveSuggestions={onFilterChanged}
      onChange={props.onChange}
    />
  )
}

export default TagPicker;
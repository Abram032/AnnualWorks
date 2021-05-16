import React, { useState } from 'react';
import { FontSizes, FontWeights, ITag, ITagPickerProps, Label, mergeStyles, TagPicker as FluentTagPicker, useTheme} from '@fluentui/react';

export interface TagPickerProps {
  name: string;
  label: string;
  tags: ITag[];
  selectedTags: ITag[];
  itemLimit: number;
  onChange: (tags?: ITag[]) => void;
  onBlur?: () => void;
  separator?: string;
  required?: boolean;
  errorMessage?: string | JSX.Element;
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

  const theme = useTheme();
  const validationErrorStyles = mergeStyles({
    color: theme.semanticColors.errorText,
    fontSize: FontSizes.size12,
    marginTop: '5px'
  });

  return (
    <>
      <Label required={props.required}>{props.label}</Label>
      <FluentTagPicker 
        key={props.name}
        itemLimit={props.itemLimit}
        onEmptyResolveSuggestions={onEmptyFilter}
        onResolveSuggestions={onFilterChanged}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      {props.errorMessage ? <span className={validationErrorStyles}>{props.errorMessage}</span> : null}
    </>
  )
}

export default TagPicker;
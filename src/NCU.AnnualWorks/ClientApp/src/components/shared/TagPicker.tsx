import React from 'react';
import { FontSizes, ITag, Label, mergeStyles, TagPicker as FluentTagPicker, useTheme } from '@fluentui/react';
import { Controller } from "react-hook-form";
import { HookFormProps } from "../../shared/Models";

interface TagPickerProps {
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
  defaultValue?: ITag[],
}

export const TagPicker: React.FC<HookFormProps<ITag[]> & TagPickerProps> = (props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      rules={props.rules}
      defaultValue={props.defaultValue || []}
      render={({
        field: { onChange, onBlur, name: fieldName, value },
        fieldState: { error }
      }) => (
        <TagPickerWrapper
          {...props}
          name={fieldName}
          onChange={(tags) => onChange(tags)}
          onBlur={onBlur}
          selectedTags={value}
          errorMessage={error && error.message}
          defaultValue={props.defaultValue}
        />
      )}
    />
  );
};

export default TagPicker;

//#region TagPickerWrapper

export const TagPickerWrapper: React.FC<TagPickerProps> = (props) => {
  const onFilterChanged = (
    filter: string,
    selectedItems?: ITag[]
  ): ITag[] | Promise<ITag[]> => {
    if (filter.endsWith(props.separator ?? ' ')) {
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

  //#region Styles

  const theme = useTheme();
  const validationErrorStyles = mergeStyles({
    color: theme.semanticColors.errorText,
    fontSize: FontSizes.size12,
    marginTop: '5px'
  });

  //#endregion

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
        defaultSelectedItems={props.defaultValue}
      />
      {props.errorMessage ? <span className={validationErrorStyles}>{props.errorMessage}</span> : null}
    </>
  )
}

//#endregion
import { FontSizes, IBasePickerSuggestionsProps, IPersonaProps, Label, mergeStyles, NormalPeoplePicker, useTheme } from '@fluentui/react';
import React from 'react';

export interface PeoplePickerProps {
  name: string,
  label: string,
  people: IPersonaProps[],
  selectedPeople: IPersonaProps[],
  onChange: (people?: IPersonaProps[]) => void, 
  onBlur?: () => void,
  peopleLimit?: number,
  maxSuggestions?: number,
  required?: boolean,
  errorMessage?: string | JSX.Element,
};

export const PeoplePicker: React.FC<PeoplePickerProps> = (props) => {
  const suggestionProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: 'Suggested People',
    mostRecentlyUsedHeaderText: 'Suggested Contacts',
    noResultsFoundText: 'No results found',
    loadingText: 'Loading',
    showRemoveButtons: true,
    suggestionsAvailableAlertText: 'People Picker Suggestions available',
    suggestionsContainerAriaLabel: 'Suggested contacts',
  };

  const onFilterChanged = (
    filter: string,
    selectedItems?: IPersonaProps[]
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    
    return props.people.filter(p => (
      p.text?.toLowerCase().startsWith(filter.toLowerCase()) || 
      p.secondaryText?.toLowerCase().startsWith(filter.toLowerCase())
    ) && !selectedItems?.includes(p))
    .sort((p1, p2) => p1.text!.localeCompare(p2.text!))
    .slice(0, props.maxSuggestions);
  };

  const onEmptyFilter = (
    selectedItems?: IPersonaProps[]
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {

    return props.people.filter(p => !selectedItems?.includes(p))
      .sort((p1, p2) => p1.text!.localeCompare(p2.text!))
      .slice(0, props.maxSuggestions);
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
      <NormalPeoplePicker
        key={props.name}
        className='people-picker'
        onEmptyResolveSuggestions={onEmptyFilter}
        onResolveSuggestions={onFilterChanged}
        pickerSuggestionsProps={suggestionProps}
        itemLimit={props.peopleLimit}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      {props.errorMessage ? <span className={validationErrorStyles}>{props.errorMessage}</span> : null}
    </>
  );
}

export default PeoplePicker;
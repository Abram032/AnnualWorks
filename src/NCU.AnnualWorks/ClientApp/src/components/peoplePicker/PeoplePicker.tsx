import { IBasePickerSuggestionsProps, IPersonaProps, NormalPeoplePicker } from '@fluentui/react';
import React from 'react';

interface PeoplePickerProps {
  people: IPersonaProps[],
  selectedPeople: IPersonaProps[],
  onChange: (people?: IPersonaProps[]) => void, 
  peopleLimit?: number,
  maxSuggestions?: number
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

  return (
    <NormalPeoplePicker
      className='people-picker'
      onEmptyResolveSuggestions={onEmptyFilter}
      onResolveSuggestions={onFilterChanged}
      pickerSuggestionsProps={suggestionProps}
      itemLimit={props.peopleLimit}
      onChange={props.onChange}
    />
  );
}

export default PeoplePicker;
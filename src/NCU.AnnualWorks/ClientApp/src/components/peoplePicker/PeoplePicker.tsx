import { IBasePickerSuggestionsProps, IPersonaProps, NormalPeoplePicker } from '@fluentui/react';
import React, { useState } from 'react';

interface PeoplePickerProps {
  peopleList: IPersonaProps[],
  peopleLimit?: number
};

export const PeoplePicker: React.FC<PeoplePickerProps> = (props) => {
  const [people] = useState<IPersonaProps[]>(props.peopleList);

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
    
    return people.filter(p => (
      p.text?.toLowerCase().startsWith(filter.toLowerCase()) || 
      p.secondaryText?.toLowerCase().startsWith(filter.toLowerCase())
    ) && !selectedItems?.includes(p) );
  };

  const onEmptyFilter = (
    selectedItems?: IPersonaProps[]
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {

    return people.filter(p => !selectedItems?.includes(p));
  }

  return (
    <NormalPeoplePicker
      className='people-picker'
      onEmptyResolveSuggestions={onEmptyFilter}
      onResolveSuggestions={onFilterChanged}
      pickerSuggestionsProps={suggestionProps}
      itemLimit={props.peopleLimit}
    />
  );
}

export default PeoplePicker;
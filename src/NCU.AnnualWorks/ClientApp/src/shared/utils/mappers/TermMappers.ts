import { Term } from '../../Models';
import { IDropdownOption } from '@fluentui/react';

export const mapTermToDropdownOptions = (term: Term): IDropdownOption => (
  {
    key: term.id,
    text: term.names.pl
  }
);

export const mapTermsToDropdownOptions = (terms: Term[]): IDropdownOption[] =>
  terms.map(t => mapTermToDropdownOptions(t));
import { Grade } from '../../Models';
import { IDropdownOption } from '@fluentui/react';

export const mapGradesToDropdownOptions = (gradeList: Grade[]): IDropdownOption[] =>
  gradeList.map<IDropdownOption>(g => ({ key: g, text: g }));
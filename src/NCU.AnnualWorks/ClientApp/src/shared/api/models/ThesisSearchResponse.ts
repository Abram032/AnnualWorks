import { Thesis } from '../../Models';

export type ThesisSearchResponse = {
  theses: Thesis[],
  itemCount: number
};
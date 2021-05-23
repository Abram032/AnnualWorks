import User from './User';
import Keyword from './Keyword';
import File from './File';
import Review from './Review';

export interface ThesisActions {
  canView: boolean,
  canPrint: boolean,
  canDownload: boolean,
  canEdit: boolean,
  canAddReview: boolean,
  canEditReview: boolean,
}

export enum ModificationType {
  Unknown,
  Created,
  TitleChanged,
  AbstractChanged,
  AuthorsChanged,
  ReviewerChanged,
  KeywordsChanged,
  Hidden,
  Visible,
  FileChanged,
  AddtionalFilesAdded,
  AdditionalFilesRemoved,
  ReviewAdded,
  ReviewChanged,
  ReveiewQuestionsUpdated
}

export interface ThesisLog {
  timestamp: Date,
  modificationType: ModificationType,
  user: User
}

export type Thesis = {
  guid: string,
  reviewGuid: string,
  title: string,
  abstract: string,
  grade?: string | null,
  promoter: User,
  reviewer: User,
  promoterReview?: Review,
  reviewerReview?: Review,
  thesisAuthors: User[],
  thesisKeywords: Keyword[],
  actions: ThesisActions,
  file: File,
  thesisAdditionalFiles: File[],
  thesisLogs: ThesisLog[],
  hidden: boolean | null,
  createdAt: Date,
};

export default Thesis;
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
  canEditGrade: boolean,
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
  fileGuid: string,
  thesisAdditionalFiles: File[],
  thesisLogs: ThesisLog[],
  hidden: boolean | null,
  createdAt: Date,
};

export default Thesis;

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
  ReveiewQuestionsUpdated,
  ReviewConfirmed,
  GradeConfirmed
}

export const ModificationTypeIcons = {
  [ModificationType.Unknown]: "Unknown",
  [ModificationType.Created]: "Add",
  [ModificationType.TitleChanged]: "Edit",
  [ModificationType.AbstractChanged]: "Edit",
  [ModificationType.AuthorsChanged]: "EditContact",
  [ModificationType.ReviewerChanged]: "EditContact",
  [ModificationType.KeywordsChanged]: "Edit",
  [ModificationType.Hidden]: "Hide3",
  [ModificationType.Visible]: "View",
  [ModificationType.FileChanged]: "PDF",
  [ModificationType.AddtionalFilesAdded]: "Photo2Add",
  [ModificationType.AdditionalFilesRemoved]: "Photo2Remove",
  [ModificationType.ReviewAdded]: "PageAdd",
  [ModificationType.ReviewChanged]: "PageEdit",
  [ModificationType.ReveiewQuestionsUpdated]: "PageLink",
  [ModificationType.ReviewConfirmed]: "PageLock",
  [ModificationType.GradeConfirmed]: "Ribbon"
}

export const ModificationTypeDescription = {
  [ModificationType.Unknown]: (user: User) => `Nieznana akcja użytkownika ${user.firstName} ${user.lastName}`,
  [ModificationType.Created]: (user: User) => `${user.firstName} ${user.lastName} dodał(a) pracę`,
  [ModificationType.TitleChanged]: (user: User) => `${user.firstName} ${user.lastName} zmienił(a) tytuł pracy`,
  [ModificationType.AbstractChanged]: (user: User) => `${user.firstName} ${user.lastName} zmienił(a) abstrakt pracy`,
  [ModificationType.AuthorsChanged]: (user: User) => `${user.firstName} ${user.lastName} zmienił(a) autorów pracy`,
  [ModificationType.ReviewerChanged]: (user: User) => `${user.firstName} ${user.lastName} zmienił(a) recenzenta pracy`,
  [ModificationType.KeywordsChanged]: (user: User) => `${user.firstName} ${user.lastName} zmienił(a) słowa kluczowe pracy`,
  [ModificationType.Hidden]: (user: User) => `${user.firstName} ${user.lastName} urkrył(a) pracę`,
  [ModificationType.Visible]: (user: User) => `${user.firstName} ${user.lastName} odkrył(a) pracę`,
  [ModificationType.FileChanged]: (user: User) => `${user.firstName} ${user.lastName} zmienił(a) plik pracy`,
  [ModificationType.AddtionalFilesAdded]: (user: User) => `${user.firstName} ${user.lastName} dodał(a) dodatkowe pliki do pracy`,
  [ModificationType.AdditionalFilesRemoved]: (user: User) => `${user.firstName} ${user.lastName} usunął(ęła) dodatkowe pliki z pracy`,
  [ModificationType.ReviewAdded]: (user: User) => `${user.firstName} ${user.lastName} dodał(a) recenzję`,
  [ModificationType.ReviewChanged]: (user: User) => `${user.firstName} ${user.lastName} zmienił(a) recenzję`,
  [ModificationType.ReveiewQuestionsUpdated]: (user: User) => `${user.firstName} ${user.lastName} zaktualizował(a) pytania w recenzji`,
  [ModificationType.ReviewConfirmed]: (user: User) => `${user.firstName} ${user.lastName} zatwierdził(a) recenzję`,
  [ModificationType.GradeConfirmed]: (user: User) => `${user.firstName} ${user.lastName} zatwierdził(a) ocenę pracy`
}
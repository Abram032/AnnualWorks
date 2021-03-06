import User from './User';
import Keyword from './Keyword';
import File from './File';
import Review from './Review';
import { Grade } from './Grades';

export interface ThesisActions {
  canView: boolean,
  canPrint: boolean,
  canDownload: boolean,
  canEdit: boolean,
  canAddReview: boolean,
  canEditReview: boolean,
  canEditGrade: boolean,
  canHide: boolean,
  canUnhide: boolean;
  canCancelGrade: boolean;
  canCancelPromoterReview: boolean;
  canCancelReviewerReview: boolean;
  canAddAdditionalFiles: boolean;
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
  availableGradeRange?: Grade[] | null,
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
  hidden: boolean,
  createdAt: Date,
  termId: string
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
  GradeConfirmed,
  GradeCanceled,
  ReviewCanceled
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
  [ModificationType.GradeConfirmed]: "Ribbon",
  [ModificationType.GradeCanceled]: "RibbonSolid",
  [ModificationType.ReviewCanceled]: "PageRemove"
}

export const ModificationTypeDescription = {
  [ModificationType.Unknown]: (user: User) => `Nieznana akcja u??ytkownika ${user.firstName} ${user.lastName}`,
  [ModificationType.Created]: (user: User) => `${user.firstName} ${user.lastName} doda??(a) prac??`,
  [ModificationType.TitleChanged]: (user: User) => `${user.firstName} ${user.lastName} zmieni??(a) tytu?? pracy`,
  [ModificationType.AbstractChanged]: (user: User) => `${user.firstName} ${user.lastName} zmieni??(a) abstrakt pracy`,
  [ModificationType.AuthorsChanged]: (user: User) => `${user.firstName} ${user.lastName} zmieni??(a) autor??w pracy`,
  [ModificationType.ReviewerChanged]: (user: User) => `${user.firstName} ${user.lastName} zmieni??(a) recenzenta pracy`,
  [ModificationType.KeywordsChanged]: (user: User) => `${user.firstName} ${user.lastName} zmieni??(a) s??owa kluczowe pracy`,
  [ModificationType.Hidden]: (user: User) => `${user.firstName} ${user.lastName} ukry??(a) prac??`,
  [ModificationType.Visible]: (user: User) => `${user.firstName} ${user.lastName} odkry??(a) prac??`,
  [ModificationType.FileChanged]: (user: User) => `${user.firstName} ${user.lastName} zmieni??(a) plik pracy`,
  [ModificationType.AddtionalFilesAdded]: (user: User) => `${user.firstName} ${user.lastName} doda??(a) dodatkowe pliki do pracy`,
  [ModificationType.AdditionalFilesRemoved]: (user: User) => `${user.firstName} ${user.lastName} usun????(????a) dodatkowe pliki z pracy`,
  [ModificationType.ReviewAdded]: (user: User) => `${user.firstName} ${user.lastName} doda??(a) recenzj??`,
  [ModificationType.ReviewChanged]: (user: User) => `${user.firstName} ${user.lastName} zmieni??(a) recenzj??`,
  [ModificationType.ReveiewQuestionsUpdated]: (user: User) => `${user.firstName} ${user.lastName} zaktualizowa??(a) pytania w recenzji`,
  [ModificationType.ReviewConfirmed]: (user: User) => `${user.firstName} ${user.lastName} zatwierdzi??(a) recenzj??`,
  [ModificationType.GradeConfirmed]: (user: User) => `${user.firstName} ${user.lastName} zatwierdzi??(a) ocen?? pracy`,
  [ModificationType.GradeCanceled]: (user: User) => `${user.firstName} ${user.lastName} anulowa??(a) ocen?? pracy`,
  [ModificationType.ReviewCanceled]: (user: User) => `${user.firstName} ${user.lastName} anulowa??(a) recenzj?? pracy`
}
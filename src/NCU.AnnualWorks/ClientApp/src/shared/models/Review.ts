export type Question = {
  id: number,
  text: string,
  order: number,
  isActive: boolean,
  isRequired: boolean,
  isNew?: boolean,
};

export type QnA = {
  question: Question,
  answer: string,
};

export type Review = {
  guid?: string,
  qnAs: QnA[],
  grade: string,
  isConfirmed: boolean,
};

export type ReviewActions = {
  canAdd: boolean,
  canEdit: boolean,
  canView: boolean,
  canDownload: boolean,
};

export default Review;
export type Question = {
  id: number,
  text: string,
  order: number,
};

export type QnA = {
  question: Question,
  answer: string,
};

export type Review = {
  guid: string,
  QnAs: QnA[],
  grade: string,
};

export default Review;
export type CreateReviewRequest = {
  thesisGuid: string,
  [question: number]: string,
  grade: string,
}
import Keyword from '../../../shared/models/Keyword';

export type CreateThesisRequest = {
  title: string,
  abstract: string,
  keywords: Keyword[],
  authorUsosIds: string[],
  reviewerUsosId: string,
  thesisFile: File
};

export default CreateThesisRequest;
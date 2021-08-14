import React from 'react';
import { ReviewForm, Loader } from '../../Components';
import { useActiveQuestions, useReview, useThesis } from '../../shared/Hooks';
import { ReviewRequestData, useApi } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';

interface ThesisEditReviewFormProps {
  thesisGuid: string,
  reviewGuid: string,
}

export const ThesisEditReviewForm: React.FC<ThesisEditReviewFormProps> = (props) => {
  const questions = useActiveQuestions();
  const [thesis, isThesisFetching] = useThesis(props.thesisGuid);
  const [review, isReviewFetching] = useReview(props.reviewGuid);
  const api = useApi();

  if(isThesisFetching || isReviewFetching || !thesis || !review) {
    return <Loader label='Ładowanie...' size='medium' />
  } 
  // else {
  //   if(!thesis || !review) {
  //     return <Redirect to={RouteNames.error} />
  //   }
  // }

  //TODO: Implement saving reviews
  const onSave = (data: ReviewRequestData) => 
  api.put(`${AppSettings.API.Reviews.Base}/${review.guid}`, data);

  return (
    <ReviewForm
      review={review}
      thesis={thesis}
      questions={questions}
      onSave={onSave}
    />
  )
};

export default ThesisEditReviewForm;
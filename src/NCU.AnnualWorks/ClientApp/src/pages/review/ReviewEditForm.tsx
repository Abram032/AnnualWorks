import React from 'react';
import { ReviewForm, Loader } from '../../Components';
import { useActiveQuestions, useReview, useThesis } from '../../shared/Hooks';
import { ReviewRequestData, useApi } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { Redirect } from 'react-router-dom';
import { RouteNames } from '../../shared/Consts';

interface ReviewEditFormProps {
  thesisGuid: string,
  reviewGuid: string,
}

export const ReviewEditForm: React.FC<ReviewEditFormProps> = (props) => {
  const [questions, questionsFetching] = useActiveQuestions();
  const [thesis, thesisFetching] = useThesis(props.thesisGuid);
  const [review, reviewFetching] = useReview(props.reviewGuid);
  const api = useApi();

  if (thesisFetching || reviewFetching || questionsFetching) {
    return <Loader />
  }

  if (!thesis || !review || !questions) {
    return <Redirect to={RouteNames.error} />
  }

  const onSave = (data: ReviewRequestData) => api.put(`${AppSettings.API.Reviews.Base}/${review.guid}`, data);

  return (
    <ReviewForm
      review={review}
      thesis={thesis}
      questions={questions}
      onSave={onSave}
    />
  )
};

export default ReviewEditForm;
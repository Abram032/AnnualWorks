import React from 'react';
import { ReviewForm, Loader } from '../../Components';
import { useActiveQuestions, useCurrentUser, useReview, useThesis, useValidateQuestions } from '../../shared/Hooks';
import { ReviewRequestData, Api } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { Redirect, useHistory } from 'react-router-dom';
import { RouteNames } from '../../shared/Consts';

interface ReviewEditFormProps {
  thesisGuid: string,
  reviewGuid: string,
}

export const ReviewEditForm: React.FC<ReviewEditFormProps> = (props) => {
  const currentUser = useCurrentUser();
  const [questions, questionsFetching] = useActiveQuestions();
  const [thesis, thesisFetching] = useThesis(props.thesisGuid);
  const [review, reviewFetching] = useReview(props.reviewGuid);
  const [isValid, isValidFetching] = useValidateQuestions(props.reviewGuid);

  if (thesisFetching || reviewFetching || questionsFetching || isValidFetching) {
    return <Loader />
  }

  if(!currentUser?.isEmployee) {
    return <Redirect to={RouteNames.forbidden} />
  }

  if (!thesis || !review || !questions) {
    return <Redirect to={RouteNames.error} />
  }

  const onSave = (data: ReviewRequestData) => Api.put(`${AppSettings.API.Reviews.Base}/${review.guid}`, data);

  return (
    <ReviewForm
      review={review}
      thesis={thesis}
      questions={questions}
      onSave={onSave}
      updateRequired={isValid}
    />
  )
};

export default ReviewEditForm;
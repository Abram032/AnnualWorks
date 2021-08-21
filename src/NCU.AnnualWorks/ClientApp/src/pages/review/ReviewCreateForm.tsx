import React from 'react';
import { ReviewForm, Loader } from '../../Components';
import { ReviewRequestData, Api } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { useThesis, useActiveQuestions, useCurrentUser } from '../../shared/Hooks';
import { Redirect } from 'react-router-dom';
import { RouteNames } from '../../shared/Consts';

interface ReviewCreateFormProps {
  thesisGuid: string
}

export const ReviewCreateForm: React.FC<ReviewCreateFormProps> = (props) => {
  const currentUser = useCurrentUser();
  const [questions, questionsFetching] = useActiveQuestions();
  const [thesis, thesisFetching] = useThesis(props.thesisGuid);

  if(questionsFetching || thesisFetching) {
    return <Loader />
  }

  if(!currentUser?.isEmployee) {
    return <Redirect to={RouteNames.forbidden} />
  }
  
  if(!questions || !thesis) {
    return <Redirect to={RouteNames.error} />
  }

  const onSave = (data: ReviewRequestData) =>  Api.post(AppSettings.API.Reviews.Base, data);

  return (
    <ReviewForm 
      thesis={thesis}
      questions={questions}
      onSave={onSave}
    />
  )
};

export default ReviewCreateForm;
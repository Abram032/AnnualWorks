import React from 'react';
import { ReviewForm, Loader } from '../../Components';
import { ReviewRequestData, useApi } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { useThesis, useActiveQuestions } from '../../shared/Hooks';
import { Redirect } from 'react-router-dom';
import { RouteNames } from '../../shared/Consts';

interface ReviewCreateFormProps {
  thesisGuid: string
}

export const ReviewCreateForm: React.FC<ReviewCreateFormProps> = (props) => {
  const api = useApi();
  const [questions, questionsFetching] = useActiveQuestions();
  const [thesis, thesisFetching] = useThesis(props.thesisGuid);

  if(questionsFetching || thesisFetching) {
    return <Loader />
  }
  
  if(!questions || !thesis) {
    return <Redirect to={RouteNames.error} />
  }

  //TODO: Implement saving reviews
  const onSave = (data: ReviewRequestData) => 
    api.post(AppSettings.API.Reviews.Base, data);

  return (
    <ReviewForm 
      thesis={thesis}
      questions={questions}
      onSave={onSave}
    />
  )
};

export default ReviewCreateForm;
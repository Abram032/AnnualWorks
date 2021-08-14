import React from 'react';
import { ReviewForm } from '../../Components';
import { ReviewRequestData, useApi } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { useThesis, useActiveQuestions } from '../../shared/Hooks';
import { Loader } from '../../Components';

interface ReviewCreateFormProps {
  thesisGuid: string
}

export const ReviewCreateForm: React.FC<ReviewCreateFormProps> = (props) => {
  const api = useApi();
  const questions = useActiveQuestions();
  const [thesis, isThesisFetching] = useThesis(props.thesisGuid);

  if(isThesisFetching || !thesis) {
    return <Loader label='Ładowanie...' size='medium' />
  } 
  // else {
  //   if(!thesis) {
  //     return <Redirect to={RouteNames.error} />
  //   }
  // }

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
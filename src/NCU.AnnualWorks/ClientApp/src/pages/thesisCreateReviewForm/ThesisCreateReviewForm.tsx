import React from 'react';
import { ThesisReviewForm } from '../../components/thesisReviewForm/ThesisReviewForm';
import { ReviewRequestData, useApi } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { useThesis, useActiveQuestions } from '../../shared/Hooks';
import Loader from '../../components/Loader';
import { Redirect } from 'react-router';
import { RouteNames } from '../../shared/consts/RouteNames';

interface ThesisCreateReviewFormProps {
  thesisGuid: string
}

export const ThesisCreateReviewForm: React.FC<ThesisCreateReviewFormProps> = (props) => {
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
    <ThesisReviewForm 
      thesis={thesis}
      questions={questions}
      onSave={onSave}
    />
  )
};

export default ThesisCreateReviewForm;
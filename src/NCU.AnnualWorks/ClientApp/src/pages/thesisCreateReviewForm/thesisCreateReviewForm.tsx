import React from 'react';
import { ThesisReviewForm } from '../../components/thesisReviewForm/thesisReviewForm';
import { useActiveQuestions } from '../../shared/hooks/QuestionHooks';
import { ReviewRequestData, useApi } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { useThesis } from '../../shared/hooks/ThesisHooks';
import Loader from '../../components/loader/loader';
import { Redirect } from 'react-router';
import { RouteNames } from '../../shared/consts/RouteNames';

interface ThesisCreateReviewFormProps {
  thesisGuid: string
}

export const ThesisCreateReviewForm: React.FC<ThesisCreateReviewFormProps> = (props) => {
  const api = useApi();
  const questions = useActiveQuestions();
  const [thesis, isThesisFetching] = useThesis(props.thesisGuid);

  if(isThesisFetching) {
    return <Loader label='Ładowanie...' size='medium' />
  } else {
    if(!thesis) {
      return <Redirect to={RouteNames.error} />
    }
  }

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
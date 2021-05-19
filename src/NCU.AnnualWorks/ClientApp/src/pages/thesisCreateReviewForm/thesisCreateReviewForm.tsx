import React, { useContext } from 'react';
import { ThesisReviewForm } from '../../components/thesisReviewForm/thesisReviewForm';
import { useActiveQuestions } from '../../shared/hooks/QuestionHooks';
import { AuthenticationContext } from '../../shared/providers/AuthenticationProvider';
import Api from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';

export const ThesisCreateReviewForm: React.FC = () => {
  const authContext = useContext(AuthenticationContext);
  const questions = useActiveQuestions();
  
  //TODO: Implement saving reviews
  const onSave = () => 
    Api.post(AppSettings.API.Theses.Base, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  return (
    <ThesisReviewForm 
      questions={questions}
      onSave={onSave}
    />
  )
};

export default ThesisCreateReviewForm;
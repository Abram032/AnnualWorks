import { CommandBar, IStackTokens, Stack, StackItem, PrimaryButton, DefaultButton, MessageBar, MessageBarType } from '@fluentui/react';
import React, { useRef, useState } from 'react';
import { addActions, updateReviewQuestionsAction } from '../thesis/ThesisActions';
import { RouteNames } from '../../shared/Consts';
import { Review, Question, Thesis } from '../../shared/Models';
import { AxiosResponse } from 'axios';
import { Tile } from '../../Components';
import { useForm } from 'react-hook-form';
import { Api, ReviewRequestData } from '../../shared/api/Api';
import { useHistory } from 'react-router-dom';
import { useBoolean } from '@fluentui/react-hooks';
import { ReviewFormConfirmDialog } from './ReviewFormConfirmDialog';
import { ReviewFormQnA } from './ReviewFormQnA';
import { scrollToTop } from '../../shared/Utils';
import { AppSettings } from '../../AppSettings';

interface ReviewFormProps {
  thesis: Thesis,
  questions: Question[],
  onSave: (data: ReviewRequestData) => Promise<AxiosResponse<any>>;
  review?: Review,
  updateRequired?: boolean,
};

export const ReviewForm: React.FC<ReviewFormProps> = (props) => {
  const history = useHistory();
  const [confirmDialogIsVisible, { toggle: toggleConfirmDialogIsVisible }] = useBoolean(true);

  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const shouldValidate = useRef<boolean>(true);
  const { handleSubmit, control } = useForm<any>({
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const uploadReview = (isConfirmed: boolean) => {
    handleSubmit(
      (values) => {
        const questionIds = Object.keys(values)
          .filter(k => !isNaN(parseInt(k)))
          .map(k => parseInt(k));
        const qnas: Record<number, string> = {};
        questionIds.forEach(i => qnas[i] = values[i]);
        props.onSave({
          thesisGuid: props.thesis.guid,
          qnAs: qnas,
          grade: values["grade"],
          isConfirmed: isConfirmed
        }).then(result => {
          scrollToTop();
          setUploadSuccess(true);
          history.push(RouteNames.detailsPath(props.thesis.guid))
        }).catch(error => {
          scrollToTop();
          setErrorMessage(error.data ?? error.message);
          setUploadSuccess(false);
        })
      },
      (err) => { 
        setErrorMessage("Popraw błędy walidacyjne przed zapisem recenzji.");
      }
    )();
  };

  const clearMessages = () => {
    setErrorMessage(undefined);
    setUploadSuccess(false);
  };

  const saveReview = () => {
    shouldValidate.current = false;
    clearMessages();
    uploadReview(false);
  };

  const saveAndConfirmReview = () => {
    shouldValidate.current = true;
    clearMessages();
    uploadReview(true);
  };

  const actionItems = addActions(props.thesis, false);
  if(props.updateRequired) {
    actionItems.push(updateReviewQuestionsAction({
      iconOnly: false,
      onClick: () => {
        Api.post(`${AppSettings.API.Reviews.UpdateQuestions}/${props.review?.guid}`)
          .then(response => {
            history.push(RouteNames.editReviewPath(props.thesis.guid, props.review?.guid!));
          })
          .catch(error => history.push(RouteNames.error));
      }
    }));
  }

  //#region Messages
  const errorMessageBar = <MessageBar messageBarType={MessageBarType.error}>{errorMessage}</MessageBar>
  const successMessageBar = <MessageBar messageBarType={MessageBarType.success}>Recenzja została zapisana</MessageBar>
  const invalidQuestionsMessageBar = (
    <MessageBar messageBarType={MessageBarType.blocked}>
      Lista pytań została zmieniona. Aby móc zrecenzować pracę, należy najpierw zaktualizować listę pytań recenzji! UWAGA! Aktualizacja pytań wyczyści dotychczasową recenzję.
    </MessageBar>
  )
  //#endregion

  return (
    <Stack style={{ width: '100%' }} tokens={stackTokens}>
      <Tile title={`Recenzja pracy - "${props.thesis.title}"`}>
        {errorMessage ? errorMessageBar : null}
        {uploadSuccess ? successMessageBar : null}
        {props.updateRequired ? invalidQuestionsMessageBar : null}
        <CommandBar className='theses-simple-list-actions' items={actionItems} />
        <ReviewFormQnA
          control={control}
          questions={props.questions}
          review={props.review}
          shouldValidate={shouldValidate.current}
        />
      </Tile>
      <Stack horizontalAlign='end' horizontal tokens={stackTokens}>
        <StackItem>
          <PrimaryButton onClick={toggleConfirmDialogIsVisible}>Zapisz i zatwierdź recenzję</PrimaryButton>
        </StackItem>
        <StackItem styles={{ root: { marginRight: "auto" } }}>
          <DefaultButton onClick={saveReview}>
            Zapisz recenzję
          </DefaultButton>
        </StackItem>
        <StackItem>
          <DefaultButton href={RouteNames.root}>Powrót do listy prac</DefaultButton>
        </StackItem>
      </Stack>
      <ReviewFormConfirmDialog
        isVisible={confirmDialogIsVisible}
        toggleIsVisible={toggleConfirmDialogIsVisible}
        onConfirm={saveAndConfirmReview}
        onSave={saveReview}
      />
    </Stack>
  )
}

export default ReviewForm;


//#region Styles

const stackTokens: IStackTokens = { childrenGap: 15 };

//#endregion
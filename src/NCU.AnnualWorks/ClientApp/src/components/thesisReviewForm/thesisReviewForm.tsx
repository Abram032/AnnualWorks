import { CommandBar, IStackTokens, Stack, StackItem, IDropdownOption, PrimaryButton, DefaultButton, MessageBar, MessageBarType, Dialog, DialogFooter, DialogType } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import Tile from '../../components/tile/tile';
import { addActions } from '../../components/thesisActions/thesisActions';
import { RouteNames } from '../../shared/consts/RouteNames';
import { Review, Question } from '../../shared/models/Review';
import { AxiosResponse } from 'axios';
import ControlledTextField from '../textField/controlledTextField';
import ControlledDropdown from '../dropdown/controlledDropdown';
import { useForm } from 'react-hook-form';
import { gradeRules, notRequiredAnswerRules } from './thesisReviewFormRules';
import { ReviewRequestData } from '../../shared/api/Api';
import Thesis from '../../shared/models/Thesis';
import { useHistory } from 'react-router-dom';
import { useBoolean, useId } from '@fluentui/react-hooks';

interface ThesisReviewFormProps {
  thesis: Thesis,
  questions: Question[],
  onSave: (data: ReviewRequestData) => Promise<AxiosResponse<any>>;
  review?: Review,
};

export const ThesisReviewForm: React.FC<ThesisReviewFormProps> = (props) => {
  const history = useHistory();
  //const shouldValidate = useRef<boolean>(true);

  const [confirmDialog, { toggle: toggleConfirmDialog }] = useBoolean(true);
  const labelId: string = useId('confirmDialogLabelId');
  const subTextId: string = useId('confirmDialogSubtextId');
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Zatwierdzanie recenzji',
    closeButtonAriaLabel: 'Close',
    subText: 'Czy jesteś pewien, że chcesz zatwierdzić swoją recenzję? Po zatwierdzeniu nie ma możliwości jej dalszej edycji oraz edycji pracy.',
  };
  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
    }),
    [labelId, subTextId],
  );

  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isUploading, setIsUploading] = useState<boolean>();
  const { handleSubmit, control } = useForm<any>({
    reValidateMode: "onSubmit",
    mode: "all",
  });

  useEffect(() => {
    if(isUploading === undefined) {
      return;
    }

    if(!isUploading && uploadSuccess) {
      //console.log("upload complete");
      return;
    }

    if(!isUploading && !uploadSuccess) {
      //console.error(errorMessage);
      return;
    }
  }, [isUploading, uploadSuccess, errorMessage]);

  const onSave = (confirm: boolean) => {
    //shouldValidate.current = false;
    setErrorMessage(undefined);
    setUploadSuccess(false);
    setIsUploading(false);
    
    handleSubmit(
      (values) => {
        setIsUploading(true);
        const questionIds = Object.keys(values)
          .filter(k => !isNaN(parseInt(k)))
          .map(k => parseInt(k));
        const qnas: Record<number, string> = {};
        questionIds.forEach(i => qnas[i] = values[i]);
        props.onSave({
          thesisGuid: props.thesis.guid,
          qnAs: qnas,
          grade: values["grade"],
          isConfirmed: confirm
        }).then(result => {
          window.scrollTo(0,0);
          setUploadSuccess(true);
          setIsUploading(false);
          history.push(RouteNames.detailsPath(props.thesis.guid))
        }).catch(error => {
          window.scrollTo(0,0);
          setErrorMessage(error.data);
          setUploadSuccess(false);
          setIsUploading(false);
        })
      },
      (err) => {
        console.log(err);
      }
    )();
  };

  const actionItems = addActions(props.thesis, history, false);

  const gradeValues = ['2', '3', '3.5', '4', '4.5', '5'];
  const grades: IDropdownOption[] = gradeValues.map<IDropdownOption>(g => ({ key: g, text: g }));

  const stackTokens: IStackTokens = { childrenGap: 15 };

  const buildFormQuestion = (index: number, question: Question, answer?: string): React.ReactNode => {
    return (
      <StackItem key={index} tokens={stackTokens}>
        <ControlledTextField
          control={control}
          name={question.id.toString()}
          label={`${index + 1}. ${question.text}`}
          //rules={question.isRequired && shouldValidate.current ? requiredAnswerRules : notRequiredAnswerRules}
          rules={notRequiredAnswerRules}
          defaultValue={answer ?? ""}
          required={question.isRequired}
          multiline
        />
      </StackItem>
    )
  }

  const buildForm = (): React.ReactNode => {
    const fields: React.ReactNode[] = [];
    if(!props.review) {
      props.questions.forEach((question, index) => 
        fields.push(buildFormQuestion(index, question)));
    } else {
      props.review.qnAs.forEach((qna, index) => 
        fields.push(buildFormQuestion(index, qna.question, qna.answer)));
    }
    
    return (
      <Stack tokens={stackTokens}>
        {fields}
        <StackItem tokens={stackTokens}>
          <ControlledDropdown
            control={control}
            name='grade'
            label='Ocena'
            rules={gradeRules}
            placeholder='Wybierz ocenę'
            options={grades}
            defaultValue={props.review?.grade ?? undefined}
            required
          />
        </StackItem>
      </Stack>
    )
  }

  const errorMessageBar = (
    <MessageBar
      messageBarType={MessageBarType.error}
    >
      {errorMessage}
    </MessageBar>
  );

  const successMessageBar = (
    <MessageBar
      messageBarType={MessageBarType.success}
    >
      Recenzja została zapisana
    </MessageBar>
  )

  return (
    <Stack style={{ width: '100%' }} tokens={stackTokens}>
      <Tile title={`Recenzja pracy - ${props.thesis.title}`}>
        {errorMessage ? errorMessageBar : null}
        {uploadSuccess ? successMessageBar : null}
        <CommandBar
          className='theses-simple-list-actions'
          items={actionItems}
        />
        {buildForm()}
      </Tile>
      <Stack horizontalAlign='end' horizontal tokens={stackTokens}>
        <StackItem>
          <PrimaryButton onClick={toggleConfirmDialog}>Zapisz i zatwierdź recenzję</PrimaryButton>
        </StackItem>
        <StackItem styles={{ root: { marginRight: "auto" } }}>
          <DefaultButton onClick={() => onSave(false)}>Zapisz recenzję</DefaultButton>
        </StackItem>
        <StackItem>
          <DefaultButton 
            //href={RouteNames.root}
            onClick={() => history.push(RouteNames.root)}
          >
              Powrót do listy prac
          </DefaultButton>
        </StackItem>
      </Stack>
      <Dialog
        hidden={confirmDialog}
        onDismiss={toggleConfirmDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={() => {
            toggleConfirmDialog();
            onSave(true);
          }} text="Zatwierdź" />
          <DefaultButton onClick={() => {
            toggleConfirmDialog();
            onSave(false);
          }} text="Zapisz" />
        </DialogFooter>
      </Dialog>
    </Stack>
  )
}

export default ThesisReviewForm;
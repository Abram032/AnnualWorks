import { CommandBar, IStackTokens, Stack, StackItem, IDropdownOption, PrimaryButton, DefaultButton, MessageBar, MessageBarType, Dialog, DialogFooter, DialogType } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import Tile from '../Tile';
import { addActions } from '../../components/thesisActions/ThesisActions';
import { RouteNames } from '../../shared/Consts';
import { Review, Question, Thesis } from '../../shared/Models';
import { AxiosResponse } from 'axios';
import { TextField } from '../TextField';
import { Dropdown } from '../Dropdown';
import { useForm } from 'react-hook-form';
import { answerRules, gradeRules, notRequiredAnswerRules } from './ThesisReviewFormRules';
import { ReviewRequestData } from '../../shared/api/Api';
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
  const confirm = useRef<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  //const [shouldRequire, setShouldRequire] = useState<boolean>(true);

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

  //TODO: Should be removed
  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isUploading, setIsUploading] = useState<boolean>();
  const { handleSubmit, control } = useForm<any>({
    reValidateMode: "onSubmit",
    mode: "all",
  });

  useEffect(() => {
    if(isSubmitting) {
      //onSave(confirm.current);
      onSave();
    }
  }, [isSubmitting]);//, confirm]);

  const onSave = () => {//(confirm: boolean) => {
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
          isConfirmed: confirm.current
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
          setIsSubmitting(false);
        })
      },
      (err) => {
        //console.log(err);
        setIsSubmitting(false);
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
        <TextField
          control={control}
          name={question.id.toString()}
          label={`${index + 1}. ${question.text}`}
          //rules={question.isRequired && shouldValidate.current ? requiredAnswerRules : notRequiredAnswerRules}
          //rules={answerRules(question.isRequired && shouldRequire.current)}
          rules={{
            required: {
              value: confirm.current && question.isRequired,
              message: "Odpowiedź jest wymagana"
            },
            validate: (value: string) => {
              if (value.length > 2500) {
                return "Maksymalna liczba znaków wynosi 2500.";
              }
            }
          }}
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
          <Dropdown
            control={control}
            name='grade'
            label='Ocena'
            //rules={gradeRules}
            rules={{
              required: {
                value: confirm.current,
                message: "Ocena jest wymagana"
              }
            }}
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
          <DefaultButton onClick={() => {
            confirm.current = false;
            //onSave(false);
            setIsSubmitting(true);
          }}>Zapisz recenzję</DefaultButton>
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
            confirm.current = true;
            toggleConfirmDialog();
            //onSave(true);
            setIsSubmitting(true);
          }} text="Zatwierdź" />
          <DefaultButton onClick={() => {
            confirm.current = false;
            toggleConfirmDialog();
            //onSave(false);
            setIsSubmitting(true);
          }} text="Zapisz" />
        </DialogFooter>
      </Dialog>
    </Stack>
  )
}

export default ThesisReviewForm;
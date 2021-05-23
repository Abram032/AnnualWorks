import { CommandBar, Dropdown, IStackTokens, Label, Stack, StackItem, TextField, IDropdownOption, PrimaryButton, DefaultButton } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import Tile from '../../components/tile/tile';
import { viewAction, downloadAction, printAction } from '../../components/thesisActions/thesisActions';
import { RouteNames } from '../../shared/consts/RouteNames';
import { Review, Question, QnA } from '../../shared/models/Review';
import { AxiosResponse } from 'axios';
import ControlledTextField from '../textField/controlledTextField';
import ControlledDropdown from '../dropdown/controlledDropdown';
import { useForm } from 'react-hook-form';
import { answerRules, gradeRules } from './thesisReviewFormRules';
import { ReviewRequestData } from '../../shared/api/Api';
import Thesis from '../../shared/models/Thesis';
import { useHistory } from 'react-router-dom';

interface ThesisReviewFormProps {
  thesis: Thesis,
  questions: Question[],
  onSave: (data: ReviewRequestData) => Promise<AxiosResponse<any>>;
  review?: Review,
};

export const ThesisReviewForm: React.FC<ThesisReviewFormProps> = (props) => {
  const history = useHistory();
  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
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
      console.log("upload complete");
      return;
    }

    if(!isUploading && !uploadSuccess) {
      console.error(errorMessages);
      return;
    }
  }, [isUploading, uploadSuccess, errorMessages]);

  const onSave = () => {
    handleSubmit(
      (values) => {
        const questionIds = Object.keys(values)
          .filter(k => !isNaN(parseInt(k)))
          .map(k => parseInt(k));
        const qnas = questionIds.map<QnA>(q => ({
          question: {
            id: q,
            text: '',
            order: 0
          },
          answer: values[q]
        }));
        const review: Review = {
          qnAs: qnas,
          grade: values["grade"]
        };
        props.onSave({
          thesisGuid: props.thesis.guid,
          review: review
        }).then(result => {
          setUploadSuccess(true);
          setIsUploading(false);
          history.push(RouteNames.detailsPath(props.thesis.guid))
        }).catch(err => {
          setUploadSuccess(false);
            setErrorMessages([err]);
            setIsUploading(false);
        })
      },
      (err) => {
        debugger;
        console.log(err);
      }
    )();
  };


  const actionItems = [
    viewAction({iconOnly: false, disabled: true}),
    downloadAction({iconOnly: false, disabled: true}),
    printAction({iconOnly: false, disabled: true}),
  ];

  const gradeValues = ['2', '3', '3.5', '4', '4.5', '5'];
  const grades: IDropdownOption[] = gradeValues.map<IDropdownOption>(g => ({ key: g, text: g }));

  const stackTokens: IStackTokens = { childrenGap: 15 };

  const buildFormQuestion = (index: number, id: number, question: string, answer?: string): React.ReactNode => {
    return (
      <StackItem tokens={stackTokens}>
        <ControlledTextField
          control={control}
          name={id.toString()}
          label={`${index + 1}. ${question}`}
          rules={answerRules}
          defaultValue={answer ?? ""}
          required
          multiline
        />
      </StackItem>
    )
  }

  const buildForm = (): React.ReactNode => {
    const fields: React.ReactNode[] = [];
    if(!props.review) {
      props.questions.forEach((question, index) => 
        fields.push(buildFormQuestion(index, question.id, question.text)));
    } else {
      props.review.qnAs.forEach((qna, index) => 
        fields.push(buildFormQuestion(index, qna.question.id, qna.question.text, qna.answer)));
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

  return (
    <Stack style={{ width: '100%' }} tokens={stackTokens}>
      <Tile title={`Recenzja pracy - ${props.thesis.title}`}>
        <CommandBar
          className='theses-simple-list-actions'
          items={actionItems}
        />
        {buildForm()}
      </Tile>
      <Stack horizontalAlign='end' horizontal tokens={stackTokens}>
        <StackItem styles={{root: { marginRight: 'auto'}}}>
          <PrimaryButton onClick={onSave}>Zapisz recenzję</PrimaryButton>
        </StackItem>
        <StackItem>
          <DefaultButton href={RouteNames.root}>Powrót do listy prac</DefaultButton>
        </StackItem>
      </Stack>
    </Stack>
  )
}

export default ThesisReviewForm;
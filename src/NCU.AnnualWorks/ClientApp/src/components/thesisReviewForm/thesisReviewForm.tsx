import { CommandBar, Dropdown, IStackTokens, Label, Stack, StackItem, TextField, IDropdownOption, PrimaryButton, DefaultButton } from '@fluentui/react';
import React from 'react';
import Tile from '../../components/tile/tile';
import { viewAction, downloadAction, printAction } from '../../components/thesisActions/thesisActions';
import { RouteNames } from '../../shared/consts/RouteNames';
import { Review, Question } from '../../shared/models/Review';
import { AxiosResponse } from 'axios';

interface ThesisReviewFormProps {
  questions: Question[],
  onSave: () => Promise<AxiosResponse<any>>;
  review?: Review,
};

export const ThesisReviewForm: React.FC<ThesisReviewFormProps> = (props) => {
  const actionItems = [
    viewAction({iconOnly: false, disabled: true}),
    downloadAction({iconOnly: false, disabled: true}),
    printAction({iconOnly: false, disabled: true}),
  ];

  const grades: IDropdownOption[] = [
    {
      key: 2,
      text: '2',
    },
    {
      key: 3,
      text: '3',
    },
    {
      key: 3.5,
      text: '3.5'
    },
    {
      key: 4,
      text: '4'
    },
    {
      key: 4.5,
      text: '4.5'
    },
    {
      key: 5,
      text: '5'
    },
  ];

  const stackTokens: IStackTokens = { childrenGap: 15 };

  const buildFormQuestion = (index: number, question: string, answer?: string): React.ReactNode => {
    return (
      <StackItem tokens={stackTokens}>
        <Label>{index + 1}. {question}</Label>
        <TextField multiline value={answer ?? ""}></TextField>
      </StackItem>
    )
  }

  const buildForm = (): React.ReactNode => {
    const fields: React.ReactNode[] = [];
    props.questions.forEach((question, index) => 
      fields.push(buildFormQuestion(index, question.text)));
    return (
      <Stack tokens={stackTokens}>
        {fields}
        <StackItem tokens={stackTokens}>
          <Dropdown 
            placeholder='Wybierz ocenę'
            label='Ocena'
            options={grades}
          />
        </StackItem>
      </Stack>
    )
  }

  return (
    <Stack style={{ width: '100%' }} tokens={stackTokens}>
      <Tile title='Recenzja pracy - Tytuł pracy 1'>
        <CommandBar
          className='theses-simple-list-actions'
          items={actionItems}
        />
        {buildForm()}
      </Tile>
      <Stack horizontalAlign='end' horizontal tokens={stackTokens}>
        <StackItem styles={{root: { marginRight: 'auto'}}}>
          <PrimaryButton href={RouteNames.details}>Zapisz recenzję</PrimaryButton>
        </StackItem>
        <StackItem>
          <DefaultButton href={RouteNames.root}>Powrót do listy prac</DefaultButton>
        </StackItem>
      </Stack>
    </Stack>
  )
}

export default ThesisReviewForm;
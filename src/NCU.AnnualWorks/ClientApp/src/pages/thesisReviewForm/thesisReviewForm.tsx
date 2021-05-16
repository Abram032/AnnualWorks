import { CommandBar, Dropdown, IStackTokens, Label, Stack, StackItem, TextField, IDropdownOption, PrimaryButton, DefaultButton } from '@fluentui/react';
import React from 'react';
import Tile from '../../components/tile/tile';
import { viewAction, downloadAction, printAction } from '../../components/thesisActions/thesisActions';
import { RouteNames } from '../../shared/consts/RouteNames';

export const ThesisReviewForm: React.FC = () => {
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
  ]

  const stackTokens: IStackTokens = { childrenGap: 15 };

  const reviewQuestions: any[] = [
    {
      key: 1,
      text: 'Czy treść pracy odpowiada tematowi określonemu w tytule?',
    },
    {
      key: 2,
      text: 'Ocena układu pracy, podziału treści, kolejności rozdziałów, kompletności tez itp.'
    },
    {
      key: 3,
      text: 'Merytoryczna ocena'
    },
    {
      key: 4,
      text: 'Czy i w jakim zakresie praca stanowi nowe ujęcie'
    },
    {
      key: 5,
      text: 'Charakterystyka doboru i wykorzystania źródeł'
    },
    {
      key: 6,
      text: 'Ocena formalnej strony pracy (poprawność języka, opanowanie techniki pisania pracy, spis rzeczy, odsyłacze)'
    },
    {
      key: 7,
      text: 'Sposób wykorzystania pracy (publikacja, udostępnienie instytucjom, materiał źródłowy)'
    },
    {
      key: 8,
      text: 'Inne uwagi'
    }
  ];

  const buildFormQuestion = (key: number, question: string): React.ReactNode => {
    return (
      <StackItem tokens={stackTokens}>
        <Label>{key}. {question}</Label>
        <TextField multiline></TextField>
      </StackItem>
    )
  }

  const buildForm = (): React.ReactNode => {
    const fields: React.ReactNode[] = [];
    reviewQuestions.forEach(q => fields.push(buildFormQuestion(q.key, q.text)));
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
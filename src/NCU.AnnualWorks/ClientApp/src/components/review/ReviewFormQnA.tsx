import React from 'react';
import { IStackTokens, Stack, StackItem } from '@fluentui/react';
import { mapGradesToDropdownOptions } from '../../shared/Utils';
import { Control } from 'react-hook-form';
import { GradeList, Question, Review } from '../../shared/Models';
import { Dropdown, TextField } from '../../Components';

interface ReviewFormQnAProps {
  review?: Review,
  questions: Question[],
  control: Control,
  shouldValidate: boolean
}

export const ReviewFormQnA: React.FC<ReviewFormQnAProps> = (props) => {

  const fields = buildForm(props.shouldValidate, props.control, props.questions, props.review);

  return (
    <Stack tokens={stackTokens}>
      {fields}
      <StackItem tokens={stackTokens}>
        <Dropdown
          control={props.control}
          name='grade'
          label='Ocena'
          //rules={gradeRules}
          rules={{
            required: {
              value: props.shouldValidate,
              message: "Ocena jest wymagana"
            }
          }}
          placeholder='Wybierz ocenę'
          options={mapGradesToDropdownOptions(GradeList)}
          defaultValue={props.review?.grade ?? undefined}
          required
        />
      </StackItem>
    </Stack>
  )
}


//#region Question Form Building

const buildForm = (shouldValidate: boolean, control: Control, questions: Question[], review?: Review) => {
  const fields: React.ReactNode[] = [];
  if (!review) {
    questions.forEach((question, index) =>
      fields.push(buildFormQuestion(shouldValidate, control, index, question)));
  } else {
    review.qnAs.forEach((qna, index) =>
      fields.push(buildFormQuestion(shouldValidate, control, index, qna.question, qna.answer)));
  }
  return fields;
}

const buildFormQuestion = (shouldValidate: boolean, control: Control, index: number, question: Question, answer?: string): React.ReactNode => {
  return (
    <StackItem key={index} tokens={stackTokens}>
      <TextField
        control={control}
        name={question.id.toString()}
        label={`${index + 1}. ${question.text}`}
        rules={{
          required: {
            value: shouldValidate && question.isRequired,
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

//#endregion

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 15 };

//#endregion
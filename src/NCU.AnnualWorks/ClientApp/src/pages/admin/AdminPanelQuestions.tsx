import React, { useEffect, useState } from "react";
import { CommandBar, DetailsList, IColumn, ICommandBarItemProps, IStackTokens, mergeStyles, MessageBar, MessageBarType, PrimaryButton, SelectionMode, Stack, StackItem } from '@fluentui/react';
import { useQuestions } from '../../shared/Hooks';
import { Checkbox, Loader, SpinButton, TextField } from '../../Components';
import { Api, UpdateReviewQuestionsRequestData } from "../../shared/api/Api";
import { AppSettings } from "../../AppSettings";
import { Redirect, useHistory } from "react-router-dom";
import { RouteNames } from "../../shared/Consts";
import { useForm } from "react-hook-form";
import { scrollToTop } from "../../shared/Utils";
import { Question } from "../../shared/Models";
import { RegisterOptions } from "react-hook-form";

export const AdminPanelQuestions: React.FC = () => {
  const history = useHistory();
  const [allQuestions, questionsFetching] = useQuestions();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const { handleSubmit, control, setValue } = useForm({
    reValidateMode: "onSubmit",
    mode: "all",
  });

  useEffect(() => {
    if(allQuestions && !questionsFetching) {
      setQuestions(allQuestions);
    }
  }, [allQuestions, questionsFetching]);

  if(questionsFetching) {
    return <Loader />
  }

  if(!allQuestions) {
    return <Redirect to={RouteNames.error} />
  }

  const onSave = () => {
    setUploadSuccess(false);
    setErrorMessage(undefined);

    handleSubmit(
      (values) => {
        console.log(values);
        const updatedQuestions: any[] = [];
        const idKeyPairs = Object.keys(values);
        for(var i = 0; i < idKeyPairs.length; i++) {
          const idKeyPair = idKeyPairs[i];
          const id = parseInt(idKeyPair.split('_').shift()!);
          const key = idKeyPair.split('_').pop()!;
          let updatedQuestion = updatedQuestions.filter(q => q.id === id).shift();
          if(updatedQuestion) {
            updatedQuestion[key] = values[idKeyPair]; 
          } else {
            updatedQuestion = {
              id: id,
              [key]: values[idKeyPair]
            };
            updatedQuestions.push(updatedQuestion);
          }
        }
        console.log(updatedQuestions);
        const request: UpdateReviewQuestionsRequestData = {
          questions: updatedQuestions
        }
        Api.put(AppSettings.API.Questions.Base, request)
          .then(res => {
            scrollToTop();
            setUploadSuccess(true);
            history.push(RouteNames.adminPanelQuestions);
          })
          .catch(err => {
            scrollToTop();
            setUploadSuccess(false);
            setErrorMessage(err.data ?? err.message);
          })
      },
      (err) => {
        setErrorMessage("Popraw błędy walidacyjne zanim zaktualizujesz pytania.");
      }
    )();
  };

  const onAddQuestion = () => {
    const newQuestions = [...questions];
    newQuestions.push({
      id: Math.max(...questions.map(q => q.id)) + 1,
      order: Math.max(...questions.map(q => q.order)) + 1,
      text: '',
      isActive: true,
      isRequired: true,
      isNew: true
    });
    setQuestions(newQuestions);
  };

  //#region Columns

  const orderColumn = (item: Question) => (
    <SpinButton
      name={`${item.id}_order`}
      control={control}
      min={0}
      value={item.order.toString()}
      defaultValue={item.order.toString()}
    />
  );
  const textColumn = (item: Question) => (
    <TextField 
      control={control}
      name={`${item.id}_text`}
      value={item.text}
      defaultValue={item.text}
      required={true}
      max={500}
      rules={textRules()}
    />
  );
  const activeColumn = (item: Question) => (
    <Checkbox 
      name={`${item.id}_isActive`}
      control={control}
      value={item.isActive}
      defaultValue={item.isActive}
    />
  );
  const requiredColumn = (item: Question) => (
    <Checkbox 
      name={`${item.id}_isRequired`}
      control={control}
      value={item.isRequired}
      defaultValue={item.isRequired}
    />
  );
  const actionsColumn = (item: Question) => {
    const actions: ICommandBarItemProps[] = [];
    if(item.isNew) {
      actions.push({
        key: 'delete',
        text: 'Usuń',
        iconProps: {
          iconName: 'Delete',
          className: `${actionStyles}`
        },
        ariaLabel: 'Delete',
        iconOnly: true,
        onClick: () => {
          const newQuestions = [...questions];
          setQuestions(newQuestions.filter(q => q.id !== item.id));
          control.unregister(`${item.id}_order`);
          control.unregister(`${item.id}_text`);
          control.unregister(`${item.id}_isActive`);
          control.unregister(`${item.id}_isRequired`);
        }
      });
    }
    return (
      <CommandBar 
        items={actions}
      />
    )
  };
  const columns: IColumn[] = [
    { key: 'order', name: 'Kolejność', fieldName: 'order', minWidth: 100, maxWidth: 100, onRender: orderColumn },
    { key: 'text', name: 'Treść pytania', fieldName: 'text', minWidth: 725, maxWidth: 725, onRender: textColumn },
    { key: 'isActive', name: 'Widoczne', fieldName: 'isActive', minWidth: 75, maxWidth: 75, onRender: activeColumn },
    { key: 'isRequired', name: 'Wymagane', fieldName: 'isRequired', minWidth: 75, maxWidth: 75, onRender: requiredColumn },
    { key: 'actions', name: 'Akcje', fieldName: 'actions', minWidth: 100, maxWidth: 100, onRender: actionsColumn }
  ];

  //#endregion Columns

  //#region Messages

  const warningMessageBar = 
    <MessageBar messageBarType={MessageBarType.severeWarning}>
      Uwaga! Zmiana treści pytania zmodyfikuje pytania widoczne na recenzji, wliczając zatwierdzone recenzje. Dodanie, ukrycie lub zmiana wymagalności pytania wpływa tylko na przyszłe oraz niezatwierdzone recenzje. W przypadku zmian, które spowodują zmianę znaczenia całego pytania, zalecane jest ukrycie starego pytania i dodanie nowego. Po aktualizacji pytań nie będzie możliwości ich usunięcia.
    </MessageBar>
  const errorMessageBar = <MessageBar messageBarType={MessageBarType.error}>{errorMessage}</MessageBar>
  const successMessageBar = <MessageBar messageBarType={MessageBarType.success}>Pytania zostały zaktualizowane.</MessageBar>

  //#endregion

  return (
    <Stack tokens={tokens}>
      {warningMessageBar}
      {uploadSuccess ? successMessageBar : null}
      {errorMessage ? errorMessageBar : null}
      <StackItem tokens={tokens}>
        <DetailsList 
          className='file-list'
          items={questions}
          columns={columns}
          selectionMode={SelectionMode.none}
          isHeaderVisible={true}
          compact
        />
      </StackItem>
      <StackItem tokens={tokens}>
        <PrimaryButton text="Dodaj pytanie" onClick={onAddQuestion} />
      </StackItem>
      <StackItem tokens={tokens}>
        <PrimaryButton text="Zaktualizuj" onClick={onSave} />
      </StackItem>
    </Stack>
  );
};

export default AdminPanelQuestions;

//#region Styles

const tokens: IStackTokens = { childrenGap: 15 };

const actionStyles = mergeStyles({
  fontWeight: '600!important'
});

//#endregion


//#region Validation

const textRules = (): RegisterOptions => {
  return {
    required: "Treść pytania jest wymagana.",
    validate: (value: string) => {
      if (value.length === 0) {
        return "Treść pytania nie może być pusta.";
      }
      if (value.length > 500) {
        return "Treść pytania nie może być dłuższa niż 500 znaków.";
      }
      return true;
    },
  };
}

//#endregion Validation
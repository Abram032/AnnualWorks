import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IDialogStyles,
  IPersonaProps,
  IStackTokens,
  ITag,
  mergeStyles,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  StackItem,
} from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { FilePickerOptions } from "../../shared/Models";
import { RouteNames } from "../../shared/Consts";
import { useTagPicker, usePeoplePicker } from "../../shared/Hooks";
import { DeepMap, FieldError, useForm } from "react-hook-form";
import { TextField, TagPicker, PeoplePicker, FilePicker, Tile } from "../../Components";
import { ThesisRequestData } from '../../shared/api/Api';
import { Keyword, Thesis, User } from "../../shared/Models";
import { titleRules, authorRules, abstractRules, tagsRules, reviewerRules, fileRules } from './ThesisFormRules';
import { AxiosResponse } from "axios";
import { mapKeywordsToTags, mapTagsToKeywords, mapUsersToPersona, mapUserToPersona } from "../../shared/Utils";
import { useHistory } from "react-router";
import { useBoolean, useId } from "@fluentui/react-hooks";

type Form = {
  guid?: string;
  title: string;
  abstract: string;
  authors: IPersonaProps[];
  reviewer: IPersonaProps[];
  tags: ITag[];
  thesisFile: FileList;
};

interface ThesisFormProps {
  keywords: Keyword[];
  students: User[];
  employees: User[];
  onSave: (formData: FormData) => Promise<AxiosResponse<any>>;
  thesis?: Thesis;
  excludedUserIds?: string[];
  fileOptions?: FilePickerOptions;
}

export const ThesisForm: React.FC<ThesisFormProps> = (props) => {
  const history = useHistory();

  //const [validFormData, setValidFormData] = useState<Form>();
  //const [validationError, setValidationError] = useState<DeepMap<Form, FieldError>>();
  const [confirmDialog, { toggle: toggleConfirmDialog }] = useBoolean(true);
  const labelId: string = useId('confirmDialogLabelId');
  const subTextId: string = useId('confirmDialogSubtextId');
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Zapis pracy',
    closeButtonAriaLabel: 'Close',
    subText: 'Czy jesteś pewien, że chcesz zapisać pracę i rozpocząć proces recenzji? Po zatwierdzeniu pierwszej recenzji nie ma możliwości dalszej edycji pracy.',
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

  const [tags, selectedTags, onChangeSelectedTags] = useTagPicker(props.keywords);
  const [authors, selectedAuthors, onChangeSelectedAuthors] = usePeoplePicker(props.students);
  const [reviewer, selectedReviewer, onChangeSelectedReviewer] = usePeoplePicker(props.employees, props.excludedUserIds);
  
  const [thesisFile, setThesisFile] = useState<FileList | null>();

  const { handleSubmit, control } = useForm<Form, any>({
    defaultValues: {
      title: props.thesis?.title ?? "",
      abstract: props.thesis?.abstract ?? "",
      authors: props.thesis?.thesisAuthors ? 
        mapUsersToPersona(props.thesis?.thesisAuthors) : [],
      reviewer: props.thesis?.reviewer ?
        [mapUserToPersona(props.thesis?.reviewer)] : [],
      tags: props.thesis?.thesisKeywords ?
        mapKeywordsToTags(props.thesis?.thesisKeywords) : []
    },
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

  const onSave = (withReview?: boolean) => {
    //setValidationError(undefined);
    //setValidFormData(undefined);
    setErrorMessage(undefined);
    setUploadSuccess(false);
    setIsUploading(false);

    handleSubmit(
      (values) => {
        //setValidFormData(values);

        setIsUploading(true);
        const data: ThesisRequestData = {
          title: values.title,
          abstract: values.abstract,
          keywords: mapTagsToKeywords(values.tags),
          reviewerUsosId: values.reviewer.map<string>(p => p.key!.toString())[0],
          authorUsosIds: values.authors.map<string>(p => p.key!.toString()),
        };
        const json = JSON.stringify(data);
        const file = values.thesisFile.item(0)!
        const blob = file as Blob;
        
        const formData = new FormData();
        formData.append("data", json);
        formData.append("thesisFile", blob, file.name);

        props.onSave(formData)
          .then(result => {
            window.scrollTo(0,0);
            setUploadSuccess(true);
            setIsUploading(false);
            if(!withReview) {
              history.push(RouteNames.detailsPath(result.data))
            } else {
              history.push(RouteNames.addReviewPath(result.data))
            }
          }).catch(error => {
            window.scrollTo(0,0);
            setErrorMessage(error.data);
            setUploadSuccess(false);
            setIsUploading(false);
          });
      },
      (err) => {
        //setValidationError(err);
      }
    )();
  };

  const stackTokens: IStackTokens = { childrenGap: 15 };
  const formStyles = mergeStyles({
    width: "100%",
  });

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
      Praca została zapisana
    </MessageBar>
  )

  const infoMessageBar = (
    <StackItem>
      <MessageBar messageBarType={MessageBarType.info}>W razie popełnienia błędu pracę lub jej dane można z edytować, do momentu zatwierdzenia przynajmniej jednej recenzji przez promotora lub recenzenta.</MessageBar>
    </StackItem>
  );

  const warningMessageBar = (
    <StackItem>
      <MessageBar messageBarType={MessageBarType.severeWarning}>UWAGA! Edycja pracy z zatwierdzoną recenzją lub recenzjami unieważni je!</MessageBar>
    </StackItem>
  );

  return (
    <Stack className={formStyles} tokens={stackTokens}>
      <Tile title="Wypełnij dane pracy">
        <Stack tokens={stackTokens}>
          {props.thesis && (props.thesis.reviewerReview || props.thesis.promoterReview) ? warningMessageBar : infoMessageBar}
          <StackItem>
            {errorMessage ? errorMessageBar : null}
            {uploadSuccess ? successMessageBar : null}
          </StackItem>
          <StackItem>
            <TextField
              required={true}
              label="Tytuł pracy"
              control={control}
              name={"title"}
              rules={titleRules}
            />
          </StackItem>
          <StackItem>
            <PeoplePicker
              required={true}
              label="Autorzy"
              name="authors"
              control={control}
              people={authors}
              selectedPeople={selectedAuthors}
              onChange={onChangeSelectedAuthors}
              peopleLimit={2}
              maxSuggestions={5}
              rules={authorRules}
              defaultValue={props.thesis ? mapUsersToPersona(props.thesis?.thesisAuthors) : []}
            />
          </StackItem>
          <StackItem>
            <TextField
              required={true}
              label="Abstrakt"
              control={control}
              name={"abstract"}
              rules={abstractRules}
              multiline
            />
          </StackItem>
          <StackItem>
            <MessageBar messageBarType={MessageBarType.info}>Nowe słowa kluczowe oddzielane są średnikiem, a następnie wybierane z listy.</MessageBar>
          </StackItem>
          <StackItem>
            <TagPicker
              required={true}
              label="Słowa kluczowe"
              name={"tags"}
              control={control}
              itemLimit={50}
              tags={tags}
              selectedTags={selectedTags}
              separator={";"}
              onChange={onChangeSelectedTags}
              rules={tagsRules}
              defaultValue={props.thesis ? mapKeywordsToTags(props.thesis?.thesisKeywords) : []}
            />
          </StackItem>
          <StackItem>
            <PeoplePicker
              required={true}
              label="Recenzent"
              name="reviewer"
              control={control}
              people={reviewer}
              selectedPeople={selectedReviewer}
              onChange={onChangeSelectedReviewer}
              peopleLimit={1}
              maxSuggestions={5}
              rules={reviewerRules}
              defaultValue={props.thesis ? mapUsersToPersona([props.thesis?.reviewer]) : []}
            />
          </StackItem>
          <StackItem>
            <FilePicker 
              id="thesisFile"
              name="thesisFile"
              label="Dodaj plik z pracą (.pdf)"
              required={true}
              control={control}
              value={thesisFile}
              onChange={(files) => setThesisFile(files)}
              options={props.fileOptions}
              rules={fileRules(props?.fileOptions)}
            />
          </StackItem>
        </Stack>
      </Tile>
      <Stack horizontalAlign="end" horizontal tokens={stackTokens}>
        <StackItem>
          {/* <PrimaryButton onClick={() => onSave(true)}> */}
          <PrimaryButton onClick={toggleConfirmDialog}>
            Zapisz pracę i zrecenzuj
          </PrimaryButton>
        </StackItem>
        <StackItem styles={{ root: { marginRight: "auto" } }}>
          <DefaultButton onClick={() => onSave()}>Zapisz pracę</DefaultButton>
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
          }} text="Zapisz i zrecenzuj" />
          <DefaultButton onClick={() => {
            toggleConfirmDialog();
            onSave(false);
          }} text="Zapisz" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};
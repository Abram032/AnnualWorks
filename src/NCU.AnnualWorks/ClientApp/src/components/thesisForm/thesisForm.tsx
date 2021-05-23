import {
  DefaultButton,
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
import FilePickerOptions from "../../components/filePicker/filePickerOptions";
import Tile from "../../components/tile/tile";
import { RouteNames } from "../../shared/consts/RouteNames";
import {  useTagPicker } from "../../shared/hooks/KeywordHooks";
import { usePeoplePicker } from "../../shared/hooks/UserHooks";
import { DeepMap, FieldError, useForm } from "react-hook-form";
import ControlledTextField from "../../components/textField/controlledTextField";
import ControlledTagPicker from "../../components/tagPicker/controlledTagPicker";
import ControlledPeoplePicker from "../../components/peoplePicker/controlledPeoplePicker";
import ControlledFilePicker from "../../components/filePicker/controlledFilePicker";
import { ThesisRequestData } from '../../shared/api/Api';
import Keyword from "../../shared/models/Keyword";
import Thesis from "../../shared/models/Thesis";
import User from "../../shared/models/User";
import { titleRules, authorRules, abstractRules, tagsRules, reviewerRules, fileRules } from './thesisFormRules';
import { AxiosResponse } from "axios";
import { mapKeywordsToTags, mapTagsToKeywords, mapUsersToPersona, mapUserToPersona } from "../../shared/utils/mappers";
import { useHistory } from "react-router";

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

  const [validFormData, setValidFormData] = useState<Form>();
  const [validationError, setValidationError] = useState<DeepMap<Form, FieldError>>();

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
      console.log("upload complete");
      return;
    }

    if(!isUploading && !uploadSuccess) {
      console.error(errorMessage);
      return;
    }
  }, [isUploading, uploadSuccess, errorMessage]);

  const onSave = (withReview?: boolean) => {
    setValidationError(undefined);
    setValidFormData(undefined);

    handleSubmit(
      (values) => {
        debugger;
        console.log(values);
        setValidFormData(values);

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
            setUploadSuccess(true);
            setIsUploading(false);
            debugger;
            if(!withReview) {
              history.push(RouteNames.detailsPath(result.data))
            } else {
              history.push(RouteNames.addReviewPath(result.data))
            }
          }).catch(err => {
            setUploadSuccess(false);
            setErrorMessage(err);
            setIsUploading(false);
            console.error(err);
          });
      },
      (err) => {
        console.log(err);
        setValidationError(err);
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

  return (
    <Stack className={formStyles} tokens={stackTokens}>
      <Tile title="Wypełnij dane pracy">
        <Stack tokens={stackTokens}>
          <StackItem>
            {errorMessage ? errorMessageBar : null}
          </StackItem>
          <StackItem>
            <ControlledTextField
              required={true}
              label="Tytuł pracy"
              control={control}
              name={"title"}
              rules={titleRules}
            />
          </StackItem>
          <StackItem>
            <ControlledPeoplePicker
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
            <ControlledTextField
              required={true}
              label="Abstrakt"
              control={control}
              name={"abstract"}
              rules={abstractRules}
            />
          </StackItem>
          <StackItem>
            <ControlledTagPicker
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
            <ControlledPeoplePicker
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
            <ControlledFilePicker 
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
          <PrimaryButton onClick={() => onSave(true)}>
            Zapisz pracę i zrecenzuj
          </PrimaryButton>
        </StackItem>
        <StackItem styles={{ root: { marginRight: "auto" } }}>
          <DefaultButton onClick={() => onSave()}>Zapisz pracę</DefaultButton>
        </StackItem>
        <StackItem>
          <DefaultButton href={RouteNames.root} onClick={() => history.push(RouteNames.root)}>
            Powrót do listy prac
          </DefaultButton>
        </StackItem>
      </Stack>
    </Stack>
  );
};
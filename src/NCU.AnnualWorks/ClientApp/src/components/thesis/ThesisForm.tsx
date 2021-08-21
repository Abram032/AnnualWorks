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
import React, { useState } from "react";
import { FilePickerOptions } from "../../shared/Models";
import { RouteNames } from "../../shared/Consts";
import { useTagPicker, usePeoplePicker } from "../../shared/Hooks";
import { useForm } from "react-hook-form";
import { TextField, TagPicker, PeoplePicker, FilePicker, Tile } from "../../Components";
import { ThesisRequestData } from '../../shared/api/Api';
import { Keyword, Thesis, User } from "../../shared/Models";
import { titleRules, authorRules, abstractRules, tagsRules, reviewerRules, fileRules } from './ThesisFormValidationRules';
import { AxiosResponse } from "axios";
import { mapKeywordsToTags, mapTagsToKeywords, mapUsersToPersona, mapUserToPersona, scrollToTop } from "../../shared/Utils";
import { useHistory } from "react-router";
import { useBoolean } from "@fluentui/react-hooks";
import { ThesisFormConfirmDialog } from './ThesisFormConfirmDialog';

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
  const [confirmDialogIsVisible, { toggle: toggleConfirmDialogIsVisible }] = useBoolean(true);

  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const [tags, selectedTags, onChangeSelectedTags] = useTagPicker(props.keywords);
  const [authors, selectedAuthors, onChangeSelectedAuthors] = usePeoplePicker(props.students);
  const [reviewer, selectedReviewer, onChangeSelectedReviewer] = usePeoplePicker(props.employees, props.excludedUserIds);
  const [thesisFile, setThesisFile] = useState<FileList | null>();

  const { handleSubmit, control } = useForm<Form, any>({
    defaultValues: {
      title: props.thesis?.title ?? "",
      abstract: props.thesis?.abstract ?? "",
      authors: props.thesis?.thesisAuthors ? mapUsersToPersona(props.thesis?.thesisAuthors) : [],
      reviewer: props.thesis?.reviewer ? [mapUserToPersona(props.thesis?.reviewer)] : [],
      tags: props.thesis?.thesisKeywords ? mapKeywordsToTags(props.thesis?.thesisKeywords) : []
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const onSave = (withReview?: boolean) => {
    setErrorMessage(undefined);
    setUploadSuccess(false);

    handleSubmit(
      (values) => {
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
            scrollToTop();
            setUploadSuccess(true);
            if(withReview && props.thesis?.promoterReview?.guid) {
              history.push(RouteNames.editReviewPath(props.thesis.guid, props.thesis.promoterReview.guid));
            } else if (!withReview) {
              history.push(RouteNames.detailsPath(result.data))
            } else {
              history.push(RouteNames.addReviewPath(result.data))
            }
          }).catch(error => {
            scrollToTop();
            setErrorMessage(error.data ?? error.message);
            setUploadSuccess(false);
          });
      },
      (err) => { 
        setErrorMessage("Popraw błędy walidacyjne przed zapisem pracy.");
      }
    )();
  };

  //#region Messages

  const errorMessageBar = <MessageBar messageBarType={MessageBarType.error}>{errorMessage}</MessageBar>;
  const successMessageBar = <MessageBar messageBarType={MessageBarType.success}>Praca została zapisana</MessageBar>;
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

  //#endregion

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
            <MessageBar messageBarType={MessageBarType.info}>
              Nowe słowa kluczowe oddzielane są średnikiem, a następnie wybierane z dostępnej listy.
            </MessageBar>
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
          <PrimaryButton onClick={toggleConfirmDialogIsVisible}>Zapisz pracę i zrecenzuj</PrimaryButton>
        </StackItem>
        <StackItem styles={{ root: { marginRight: "auto" } }}>
          <DefaultButton onClick={() => onSave()}>Zapisz pracę</DefaultButton>
        </StackItem>
        <StackItem>
          <DefaultButton href={RouteNames.root}>Powrót do listy prac</DefaultButton>
        </StackItem>
      </Stack>
      <ThesisFormConfirmDialog
        isVisible={confirmDialogIsVisible}
        toggleIsVisible={toggleConfirmDialogIsVisible}
        onConfirm={() => onSave(true)}
        onSave={() => onSave(false)}
      />
    </Stack>
  );
};

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 15 };
const formStyles = mergeStyles({
  width: "100%",
});

//#endregion
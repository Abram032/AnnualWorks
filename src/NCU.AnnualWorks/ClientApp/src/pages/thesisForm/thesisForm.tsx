import {
  DefaultButton,
  IPersonaProps,
  IStackTokens,
  ITag,
  mergeStyles,
  PrimaryButton,
  Stack,
  StackItem,
} from "@fluentui/react";
import React, { useContext, useEffect, useState } from "react";
import FilePickerOptions from "../../components/filePicker/filePickerOptions";
import Tile from "../../components/tile/tile";
import { RouteNames } from "../../shared/consts/RouteNames";
import { useKeywords, useTagPicker } from "../../shared/hooks/KeywordHooks";
import {
  useStudents,
  useEmployees,
  usePeoplePicker,
} from "../../shared/hooks/UserHooks";
import { AuthenticationContext } from "../../shared/providers/AuthenticationProvider";
import { DeepMap, FieldError, useForm } from "react-hook-form";
import ControlledTextField from "../../components/textField/controlledTextField";
import ControlledTagPicker from "../../components/tagPicker/controlledTagPicker";
import ControlledPeoplePicker from "../../components/peoplePicker/controlledPeoplePicker";
import ControlledFilePicker from "../../components/filePicker/controlledFilePicker";
import mime from "mime-types";
import Api, { ThesisRequestData } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import Keyword from "../../shared/models/Keyword";

type Form = {
  guid?: string;
  title: string;
  abstract: string;
  authors: IPersonaProps[];
  reviewer: IPersonaProps[];
  tags: ITag[];
  thesisFile: FileList;
};

export const ThesisForm: React.FC = (props) => {
  const authContext = useContext(AuthenticationContext);

  const [validFormData, setValidFormData] = useState<Form>();
  const [validationError, setValidationError] =useState<DeepMap<Form, FieldError>>();
  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>();

  const [tags, selectedTags, onChangeSelectedTags] = useTagPicker(useKeywords());
  const [authors, selectedAuthors, onChangeSelectedAuthors] = usePeoplePicker(useStudents());
  const [reviewer, selectedReviewer, onChangeSelectedReviewer] = usePeoplePicker(useEmployees(), [authContext.currentUser?.id]);

  const [thesisFile, setThesisFile] = useState<FileList | null>();
  const filePickerOptions: FilePickerOptions = {
    allowedExtensions: [".pdf"],
    maxFileCount: 1,
    maxSize: 10000000
  };

  const stackTokens: IStackTokens = { childrenGap: 15 };

  const formStyles = mergeStyles({
    width: "100%",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Form, any>({
    defaultValues: {
      title: "",
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
      console.error(errorMessages);
      return;
    }
  }, [isUploading, uploadSuccess, errorMessages])

  const onSave = () => {
    setValidationError(undefined);
    setValidFormData(undefined);

    handleSubmit(
      (values) => {
        console.log(values);
        setValidFormData(values);

        setIsUploading(true);
        const data: ThesisRequestData = {
          title: values.title,
          abstract: values.abstract,
          keywords: values.tags.map<Keyword>(p => ({ 
            id: isNaN(parseInt(p.key.toString())) ? 0 : parseInt(p.key.toString()), 
            text: p.name 
          })),
          reviewerUsosId: values.reviewer.map<string>(p => p.key!.toString())[0],
          authorUsosIds: values.authors.map<string>(p => p.key!.toString()),
        };
        const json = JSON.stringify(data);
        const file = values.thesisFile.item(0)!
        const blob = file as Blob;
        
        const formData = new FormData();
        formData.append("data", json);
        formData.append("thesisFile", blob, file.name);
        Api.post(AppSettings.API.Theses.Base, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }).then(result => {
          setUploadSuccess(true);
          setIsUploading(false);
          console.log(result.data);
        }).catch(err => {
          setUploadSuccess(false);
          setErrorMessages([err]);
          setIsUploading(false);
          console.error(err);
        })
      },
      (err) => {
        console.log(err);
        setValidationError(err);
      }
    )();
  };

  return (
    <Stack className={formStyles} tokens={stackTokens}>
      <Tile title="Wypełnij dane pracy">
        <Stack tokens={stackTokens}>
          <StackItem>
            <ControlledTextField
              required={true}
              label="Tytuł pracy"
              control={control}
              name={"title"}
              rules={{
                required: "Tytuł jest wymagany.",
                validate: (value: string) => {
                  if (value.length > 1000) {
                    return "Maksymalna liczba znaków wynosi 1000.";
                  }
                },
              }}
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
              rules={{
                validate: (value: IPersonaProps[]) => {
                  if (value.length === 0) {
                    return "Wymagany jest co najmniej 1 autor.";
                  }
                  if (value.length > 2) {
                    return "Maksymalna liczba autorów to 2.";
                  }
                  return true;
                },
              }}
            />
          </StackItem>
          <StackItem>
            <ControlledTextField
              required={true}
              label="Abstrakt"
              control={control}
              name={"abstract"}
              rules={{
                required: "Abstrakt jest wymagany.",
                validate: (value: string) => {
                  if (value.length > 4000) {
                    return "Maksymalna liczba znaków wynosi 4000.";
                  }
                },
              }}
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
              rules={{
                validate: (value: ITag[]) => {
                  if (value.length === 0) {
                    return "Wymagane jest co najmniej 1 słowo kluczowe.";
                  }
                  if (value.some((p) => p.name.length === 0)) {
                    return "Słowo kluczowe nie może być puste.";
                  }
                  if (value.some((p) => p.name.length > 255)) {
                    return "Maksymalna długość słowa kluczowego to 255 znaków.";
                  }
                  if (value.length > 50) {
                    return "Maksymalna liczba słów kluczowych to 50.";
                  }
                  return true;
                },
              }}
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
              rules={{
                validate: (value: IPersonaProps[]) => {
                  if (value.length === 0) {
                    return "Recenzent jest wymagany.";
                  }
                  if (value.length > 1) {
                    return "Maksymalna liczba recenzentów wynosi 1.";
                  }
                  return true;
                },
              }}
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
              options={filePickerOptions}
              rules={{
                required: "Plik z pracą jest wymagany",
                validate: (value: FileList) => {
                  if (value.length === 0) {
                    return "Plik z pracą jest wymagany.";
                  }
                  if (value.length > 1) {
                    return "Maksymalna liczba plików wynosi 1.";
                  }
                  if (value[0].name.length > 255) {
                    return "Maksymalna długość nazwy pliku to 255 znaków.";
                  }
                  if (filePickerOptions.maxSize && value[0].size > filePickerOptions.maxSize) {
                    return `Rozmiar pliku jest zbyt duży. Maksymalny rozmiar pliku to ${filePickerOptions.maxSize / 1000 / 1000}MB`;
                  }
                  const extension = mime.extension(value[0].type);
                  if (!extension) {
                    return "Nieznany format pliku.";
                  }
                  if (extension !== "pdf") {
                    return "Nieprawidłowy format pliku. Dozwolone formaty: '.pdf";
                  }
                  return true;
                },
              }}
            />
          </StackItem>
        </Stack>
      </Tile>
      <Stack horizontalAlign="end" horizontal tokens={stackTokens}>
        <StackItem>
          <PrimaryButton href={RouteNames.review}>
            Zapisz pracę i zrecenzuj
          </PrimaryButton>
        </StackItem>
        <StackItem styles={{ root: { marginRight: "auto" } }}>
          <DefaultButton onClick={onSave}>Zapisz pracę</DefaultButton>
        </StackItem>
        <StackItem>
          <DefaultButton href={RouteNames.root}>
            Powrót do listy prac
          </DefaultButton>
        </StackItem>
      </Stack>
    </Stack>
  );
};

export default ThesisForm;

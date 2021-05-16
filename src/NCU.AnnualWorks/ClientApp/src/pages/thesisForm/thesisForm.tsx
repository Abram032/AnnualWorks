import { DefaultButton, IStackTokens, Label, mergeStyles, PrimaryButton, Stack, StackItem, TextField } from '@fluentui/react';
import React, { useContext, useState } from 'react';
import FilePicker from '../../components/filePicker/filePicker';
import FilePickerOptions from '../../components/filePicker/filePickerOptions';
import PeoplePicker from '../../components/peoplePicker/peoplePicker';
import TagPicker from '../../components/tagPicker/tagPicker';
import Tile from '../../components/tile/tile';
import { RouteNames } from '../../shared/consts/RouteNames';
import { useKeywords, useTagPicker } from '../../shared/hooks/KeywordHooks';
import { useStudents, useEmployees, usePeoplePicker } from '../../shared/hooks/UserHooks';
import { AuthenticationContext } from '../../shared/providers/AuthenticationProvider';
import { useForm } from 'react-hook-form';

export const ThesisForm: React.FC = (props) => {
  const authContext = useContext(AuthenticationContext);

  const [tags, selectedTags, onChangeSelectedTags] = useTagPicker(useKeywords());
  const [authors, selectedAuthors, onChangeSelectedAuthors] = usePeoplePicker(useStudents());
  const [reviewer, selectedReviewer, onChangeSelectedReviewer] = usePeoplePicker(useEmployees(), [authContext.currentUser?.id]);

  const [thesisFile, setThesisFile] = useState<FileList | null>();
  const filePickerOptions: FilePickerOptions = {
    allowedExtensions: ['.pdf'],
    maxFileCount: 1
  };

  const stackTokens: IStackTokens = {childrenGap: 15}

  const formStyles = mergeStyles({
    width: '100%'
  });

  const { register, handleSubmit, formState: { errors }} = useForm();
  // const onSubmit = (data: any) => {
  //   debugger;
  //   const reviewerUsosId = lecturers[0].key;
  //   const authorUsosIds = participants.map(p => p.key);
  //   const keywords = tags.map<Keyword>(t => ({ id: t.key as number, text: t.name }));
  //   const file = thesisFile;

  //   const formData = new FormData();
  //   formData.append('title', data.title);
  //   formData.append('abstract', data.abstract);
  //   formData.append('reviewerUsosId', reviewerUsosId as string);
  //   //formData.append('authorUsosIds', authorUsosIds as blob);
  //   //formData.append('thesisFile', file?.item()., file.)
  // };

  return (
    <Stack className={formStyles} tokens={stackTokens}>
      <form onSubmit={handleSubmit(() => {})}>
        <Tile title='Wypełnij dane pracy'>
          <Stack tokens={stackTokens}>
            <StackItem>
              <Label>Tytuł pracy</Label>
              <TextField/>
            </StackItem>
            <StackItem>
              <Label>Autorzy</Label>
              <PeoplePicker 
                people={authors} 
                selectedPeople={selectedAuthors}
                onChange={onChangeSelectedAuthors}
                peopleLimit={2}
                maxSuggestions={5} 
              />
            </StackItem>
            <StackItem>
              <Label>Abstrakt</Label>
              <TextField multiline />
            </StackItem>
            <StackItem>
              <Label>Słowa kluczowe</Label>
              <TagPicker 
                tags={tags}
                selectedTags={selectedTags}
                separator={';'}
                onChange={onChangeSelectedTags}
              />
            </StackItem>
            <StackItem>
              <Label>Recenzent</Label>
              <PeoplePicker 
                people={reviewer} 
                selectedPeople={selectedReviewer}
                onChange={onChangeSelectedReviewer}
                peopleLimit={1} 
                maxSuggestions={5} 
              />
            </StackItem>
            <StackItem>
              <Label>Dodaj plik z pracą (.pdf)</Label>
              <Stack horizontal tokens={stackTokens}>
                <StackItem>
                  <FilePicker 
                    id='ThesisUpload'
                    onChange={(files) => setThesisFile(files)} 
                    options={filePickerOptions}
                  />
                </StackItem>
                <StackItem grow={2}>
                  <TextField value={thesisFile?.item(0)?.name ?? 'Nie wybrano żadnego pliku'} readOnly />
                </StackItem>
              </Stack>
            </StackItem>
          </Stack>
        </Tile>
        <Stack horizontalAlign='end' horizontal tokens={stackTokens}>
          <StackItem>
            <PrimaryButton href={RouteNames.review}>Zapisz pracę i zrecenzuj</PrimaryButton>
          </StackItem>
          <StackItem styles={{root: { marginRight: 'auto'}}}>
            <DefaultButton type="submit">Zapisz pracę</DefaultButton>
          </StackItem>
          <StackItem>
            <DefaultButton href={RouteNames.root}>Powrót do listy prac</DefaultButton>
          </StackItem>
        </Stack>
      </form>
    </Stack>
  );
}

export default ThesisForm;
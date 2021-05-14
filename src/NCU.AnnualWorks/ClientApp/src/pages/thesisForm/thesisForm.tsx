import { DefaultButton, IPersonaProps, IStackTokens, ITag, Label, mergeStyles, PrimaryButton, Stack, StackItem, TextField } from '@fluentui/react';
import React, { useContext, useEffect, useState } from 'react';
import FilePicker from '../../components/filePicker/filePicker';
import FilePickerOptions from '../../components/filePicker/filePickerOptions';
import PeoplePicker from '../../components/peoplePicker/peoplePicker';
import TagPicker from '../../components/tagPicker/tagPicker';
import Tile from '../../components/tile/tile';
import { RouteNames } from '../../shared/consts/RouteNames';
import useKeywords from '../../shared/hooks/KeywordHooks';
import { useStudents, useEmployees } from '../../shared/hooks/UserHooks';
import { AuthenticationContext } from '../../shared/providers/AuthenticationProvider';

export const ThesisForm: React.FC = (props) => {
  const authContext = useContext(AuthenticationContext);
  const [participants, setParticipants] = useState<IPersonaProps[]>([]);
  const [lecturers, setLecturers] = useState<IPersonaProps[]>([]);
  const [files, setFiles] = useState<FileList | null>();
  const [tags, setTags] = useState<ITag[]>([]);
  const filePickerOptions: FilePickerOptions = {
    allowedExtensions: ['.pdf'],
    maxFileCount: 1
  };

  const keywords = useKeywords();
  useEffect(() => {
    setTags(keywords.map<ITag>(k => ({ key: k.id, name: k.text })));
  }, [keywords]);

  const students = useStudents();
  useEffect(() => {
    setParticipants(students.map<IPersonaProps>(s => ({
      key: s.usosId,
      text: `${s.firstName} ${s.lastName}`,
      secondaryText: s.email,
      imageUrl: s.photoUrl
    })));
  }, [students]);

  const employees = useEmployees();
  useEffect(() => {
    setLecturers(employees
      .filter(e => e.usosId !== authContext.currentUser?.id)
      .map<IPersonaProps>(e => ({
      key: e.usosId,
      text: `${e.firstName} ${e.lastName}`,
      secondaryText: e.email,
      imageUrl: e.photoUrl
    })));
  }, [employees]);

  const stackTokens: IStackTokens = {childrenGap: 15}

  const formStyles = mergeStyles({
    width: '100%'
  });

  return (
    <Stack className={formStyles} tokens={stackTokens}>
      <Tile title='Wypełnij dane pracy'>
        <Stack tokens={stackTokens}>
          <StackItem>
            <Label>Tytuł pracy</Label>
            <TextField></TextField>
          </StackItem>
          <StackItem>
            <Label>Autorzy</Label>
            <PeoplePicker people={participants} maxSuggestions={5} />
          </StackItem>
          <StackItem>
            <Label>Abstrakt</Label>
            <TextField multiline></TextField>
          </StackItem>
          <StackItem>
            <Label>Słowa kluczowe</Label>
            <TagPicker 
              tags={tags}
              separator={';'}
            />
          </StackItem>
          <StackItem>
            <Label>Recenzent</Label>
            <PeoplePicker people={lecturers} peopleLimit={1} maxSuggestions={5} />
          </StackItem>
          <StackItem>
            <Label>Dodaj plik z pracą (.pdf)</Label>
            <Stack horizontal tokens={stackTokens}>
              <StackItem>
                <FilePicker 
                  id='ThesisUpload'
                  onChange={(files) => setFiles(files)} 
                  options={filePickerOptions}
                />
              </StackItem>
              <StackItem grow={2}>
                <TextField value={files?.item(0)?.name ?? 'Nie wybrano żadnego pliku'} readOnly />
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
          <DefaultButton href={RouteNames.details}>Zapisz pracę</DefaultButton>
        </StackItem>
        <StackItem>
          <DefaultButton href={RouteNames.root}>Powrót do listy prac</DefaultButton>
        </StackItem>
      </Stack>
    </Stack>
  );
}

export default ThesisForm;
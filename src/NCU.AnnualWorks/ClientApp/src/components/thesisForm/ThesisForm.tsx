import { DefaultButton, IPersonaProps, IStackTokens, ITag, Label, PrimaryButton, Stack, StackItem, TextField } from '@fluentui/react';
import React, { useState } from 'react';
import Tile from '../tile/Tile';
import TagPicker from '../tagPicker/TagPicker';
import PeoplePicker from '../peoplePicker/PeoplePicker';
import FilePicker from '../filePicker/FilePicker';
import FilePickerOptions from '../filePicker/FilePickerOptions';

export const ThesisForm: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>();
  const filePickerOptions: FilePickerOptions = {
    allowedExtensions: ['.pdf'],
    maxFileCount: 1
  };

  const [tags, setTags] = useState<ITag[]>([]);

  const stackTokens: IStackTokens = {childrenGap: 15}

  const participantList: IPersonaProps[] = [
    {
      text: 'Jan Nowak',
      secondaryText: '123456@stud.umk.pl'
    },
    {
      text: 'Jan Kowalski',
      secondaryText: '234567@stud.umk.pl'
    },
    {
      text: 'Alicja Kowalska',
      secondaryText: '345678@stud.umk.pl'
    }
  ];

  const employeeList: IPersonaProps[] = [
    {
      text: 'Arkadiusz Nowak',
      secondaryText: 'anowak@umk.pl'
    },
    {
      text: 'Jan Nowacki',
      secondaryText: 'jnowacki@umk.pl'
    },
    {
      text: 'Marcel Kowalczyk',
      secondaryText: 'mkowalczyk@umk.pl'
    }
  ];

  const tagList: ITag[] = [
    {
      key: 'test',
      name: 'test'
    },
    {
      key: 'test2',
      name: 'test2'
    },
  ]

  return (
    <Stack tokens={stackTokens}>
      <Tile title='Wypełnij dane pracy'>
        <Stack>
          <Label>Tytuł pracy</Label>
          <TextField></TextField>
          <Label>Autorzy</Label>
          <PeoplePicker peopleList={participantList}/>
          <Label>Abstrakt</Label>
          <TextField multiline></TextField>
          <Label>Słowa kluczowe</Label>
          <TagPicker 
            tagList={tagList}
            separator={' '}
          />
          <Label>Recenzent</Label>
          <PeoplePicker peopleList={employeeList} peopleLimit={1}/>
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
        </Stack>
      </Tile>
      <Stack horizontalAlign='end' horizontal tokens={stackTokens}>
        <StackItem>
          <PrimaryButton>Zapisz pracę i zrecenzuj</PrimaryButton>
        </StackItem>
        <StackItem styles={{root: { marginRight: 'auto'}}}>
          <DefaultButton>Zapisz pracę</DefaultButton>
        </StackItem>
        <StackItem>
          <DefaultButton>Powrót do listy prac</DefaultButton>
        </StackItem>
      </Stack>
    </Stack>
  );
}
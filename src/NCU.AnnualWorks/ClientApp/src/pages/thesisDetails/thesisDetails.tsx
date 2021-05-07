import { CommandBar, DetailsRow, FontSizes, IColumn, IconButton, IStackTokens, Label, SelectionMode, Stack } from '@fluentui/react';
import React from 'react';
import { addReviewAction, downloadAction, editAction, printAction, viewAction } from '../../components/thesisActions/thesisActions';
import Tile from '../../components/tile/tile';

export const ThesisDetails: React.FC = (props) => {
  const actionItems = [
    viewAction({iconOnly: false}),
    downloadAction({iconOnly: false}),
    editAction({iconOnly: false}),
    printAction({iconOnly: false}),
    addReviewAction({iconOnly: false}),
    //editReviewAction({iconOnly: false}),
  ];

  const columns: IColumn[] = [
    { key: 'action', name: 'Akcja', fieldName: 'action', minWidth: 50, maxWidth: 50 },
    { key: 'name', name: 'Imie i nazwisko', fieldName: 'name', minWidth: 200, maxWidth: 500 },
    { key: 'grade', name: 'Ocena', fieldName: 'grade', minWidth: 200, maxWidth: 500 },
  ];

  const reviewP = {
    name: 'Jan Nowak',
    grade: 4
  };

  const reviewR = {
    name: 'Jan Kowalski',
    grade: 5
  };

  const onRenderItemColumn = (
    item: any,
    itemIndex?: number,
    column?: IColumn
  ): React.ReactNode => {
    switch (column?.key) {
      case 'action':
        return <IconButton iconProps={{ iconName: 'PageAdd' }} />
      case 'name':
        return <Label>{item.name}</Label>
      case 'grade':
        return <Label>Ocena: {item.grade}</Label>
      default:
        return null;
    }
  }

  const stackTokens: IStackTokens = { childrenGap: 10 }

  return (
    <Tile title='Tytuł pracy'>
      {/* Due to a bug, command bar cannot be put inside a flexbox https://github.com/microsoft/fluentui/issues/16268 */}
      <Stack>
        <CommandBar
          className='theses-simple-list-actions'
          items={actionItems}
        />
      </Stack>
      <Stack tokens={stackTokens}>
        <Label>Dodana: 06.05.2021</Label>
        <Label>Termin: 07.05.2021</Label>
        <Label>Autor: Jan Kowalski</Label>
      </Stack>
      <Stack tokens={stackTokens}>
        <Label style={{fontSize: FontSizes.size20}}>Abstrakt:</Label>
        <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
        <Label style={{fontSize: FontSizes.size20}}>Słowa kluczowe:</Label>
        <p>Słowo1, Słowo2, Słowo3, Słowo4, Słowo5, Słowo6</p>
        <Label style={{fontSize: FontSizes.size20}}>Recenzja promotora:</Label>
        <DetailsRow 
          selectionMode={SelectionMode.none}
          itemIndex={0}
          item={reviewP} 
          columns={columns}
          onRenderItemColumn={onRenderItemColumn}
        />
        <Label style={{fontSize: FontSizes.size20}}>Recenzja recenzenta:</Label>
        <DetailsRow 
          selectionMode={SelectionMode.none}
          itemIndex={0}
          item={reviewR} 
          columns={columns}
          onRenderItemColumn={onRenderItemColumn}
        />
      </Stack>
    </Tile>
  );
}

export default ThesisDetails;
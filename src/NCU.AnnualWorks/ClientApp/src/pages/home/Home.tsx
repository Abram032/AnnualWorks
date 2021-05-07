import React, { useContext } from "react";
import { AuthenticationContext } from '../../shared/providers/AuthenticationProvider';
import { AppSettings } from '../../AppSettings';
import { ColumnActionsMode, CommandBar, DefaultButton, DetailsList, DetailsRow, FontSizes, GroupedList, ICellStyleProps, IColumn, IGroup, IStackTokens, Label, Link, OverflowSet, PrimaryButton, SelectionMode, Stack } from "@fluentui/react";
import Tile from '../../components/tile/Tile';
import ThesesSimpleList from '../../components/thesesLists/ThesesSimpleList';
import ThesesGroupedList from '../../components/thesesLists/ThesesGroupedList';

export const Home: React.FC = () => {
  const authContext = useContext(AuthenticationContext);

  const itemsP: any[] = [
    {
      id: 1,
      title: 'Promowana praca 1',
      canPrint: true,
      canDownload: true,
      canEdit: true,
      canAddReview: true,
      canEditReview: false
    },
    {
      id: 2,
      title: 'Promowana praca 2',
      canPrint: true,
      canDownload: true,
      canEdit: true,
      canAddReview: false,
      canEditReview: true
    },
  ];

  const itemsR: any[] = [
    {
      id: 3,
      title: 'Recenzowana praca 1',
      canPrint: true,
      canDownload: true,
      canEdit: false,
      canAddReview: false,
      canEditReview: true
    },
    {
      id: 4,
      title: 'Recenzowana praca 2',
      canPrint: true,
      canDownload: true,
      canEdit: false,
      canAddReview: true,
      canEditReview: false
    },
  ];

  const itemsI: any[] = [
    ...itemsP,
    ...itemsR,
    {
      id: 5,
      title: 'Inna praca 1',
      canPrint: true,
      canDownload: true,
      canEdit: false,
      canAddReview: false,
      canEditReview: false
    },
    {
      id: 6,
      title: 'Inna praca 2',
      canPrint: true,
      canDownload: true,
      canEdit: false,
      canAddReview: false,
      canEditReview: false
    },
  ]

  // const itemsT: any[] = [
  //   { 
  //     id: 1, 
  //     title: 'Praca A',
  //     term: '2018/19Z',
  //     termFullName: 'Semestr zimowy 2018/2019',
  //   },
  //   { id: 2, title: 'Praca B' },
  //   { id: 3, title: 'Praca C' },
  //   { id: 4, title: 'Praca D' },
  //   { id: 5, title: 'Praca E' },
  //   { id: 6, title: 'Praca F' },
  //   { id: 7, title: 'Praca G' },
  //   { id: 8, title: 'Praca H' },
  // ];

  // const itemsG: any[] = [
  //   {
  //     key: '2018/19Z',
  //     term: 'Semestr zimowy 2018/2019',
  //     items: itemsT
  //   },
  //   {
  //     key: '2019/20Z',
  //     term: 'Semestr zimowy 2019/2020',
  //     items: itemsT
  //   },
  // ]

  const stackTokens: IStackTokens = { childrenGap: 25 }

  return (
    <Tile title='Lista prac rocznych'>
      <Stack horizontal horizontalAlign='end' tokens={stackTokens}>
        <PrimaryButton href='/add'>Dodaj pracę</PrimaryButton>
        <Label>Termin końcowy: 07.05.2021</Label>
      </Stack>
      <ThesesSimpleList title='Promowane prace' items={itemsP} isCollapsed={false}/>
      <ThesesSimpleList title='Recenzowane prace' items={itemsR} isCollapsed={false}/>
      <ThesesSimpleList title='Semestr zimowy 2020/2021' items={itemsI} />
      {/* <ThesesGroupedList title='Pozostałe prace' items={itemsG} /> */}
    </Tile>
  );
};

export default Home;

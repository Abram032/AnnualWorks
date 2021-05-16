import React from "react";
import {  IStackTokens, Label, PrimaryButton, Stack } from "@fluentui/react";
import Tile from '../../components/tile/tile';
import ThesisList from '../../components/thesisList/thesisList';
import { RouteNames } from "../../shared/consts/RouteNames";

export const Home: React.FC = () => {

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

  const stackTokens: IStackTokens = { childrenGap: 25 }

  return (
    <Tile title='Lista prac rocznych'>
      <Stack horizontal horizontalAlign='end' tokens={stackTokens}>
        <PrimaryButton href={RouteNames.addthesis}>Dodaj pracę</PrimaryButton>
        <Label>Termin końcowy: 07.05.2021</Label>
      </Stack>
      <ThesisList title='Promowane prace' items={itemsP} isCollapsed={false}/>
      <ThesisList title='Recenzowane prace' items={itemsR} isCollapsed={false}/>
      <ThesisList title='Semestr zimowy 2020/2021' items={itemsI} />
    </Tile>
  );
};

export default Home;

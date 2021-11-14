import { DetailsList, FontSizes, IColumn, IStackTokens, Label, mergeStyles, Persona, PersonaSize, SelectionMode, Stack, StackItem } from '@fluentui/react';
import React from 'react';
import { RouteNames } from '../../shared/Consts';
import { Term, Thesis, User } from '../../shared/Models';
import { Link } from '../../Components';

interface SearchResultListProps {
  terms: Term[],
  theses: Thesis[],
  users: User[]
};

export const SearchResultList: React.FC<SearchResultListProps> = (props) => {
  const getPersona = (user: User) => {
    return (
      <Persona 
        className={fontStyles}
        imageUrl={props.users.filter(u => u.usosId === user.usosId)?.shift()?.photoUrl}
        text={props.users.filter(u => u.usosId === user.usosId)?.map(u => `${u.firstName} ${u.lastName}`)?.shift()}
        imageAlt={props.users.filter(u => u.usosId === user.usosId)?.map(u => `${u.firstName} ${u.lastName}`)?.shift()}
        size={PersonaSize.size24}
      />
    )
  }

  const getPersonas = (users: User[]) => {
    return users.map(u => getPersona(u));
  }

  const columns: IColumn[] = [
    {
      key: 'title',
      name: 'Tytuł',
      minWidth: 600,
      onRender: (item: Thesis) => (
        <Link href={RouteNames.detailsPath(item.guid)} className={fontStyles}>{item.title}</Link>
      )
    },
    {
      key: 'users',
      name: 'Osoby',
      minWidth: 400,
      onRender: (item: Thesis) => (
        <Stack tokens={tokens}>
          <Stack horizontal tokens={tokens}>
            <Label>{item.thesisAuthors.length === 1 ? "Autor" : "Autorzy"}</Label>
            {getPersonas(item.thesisAuthors)}
          </Stack>
          <Stack horizontal tokens={tokens}>
            <Label>Promotor</Label>
            {getPersona(item.promoter)}
          </Stack>
          <Stack horizontal tokens={tokens}>
            <Label>Recenzent</Label>
            {getPersona(item.reviewer)}
          </Stack>
        </Stack>
      )
    },
    {
      key: 'term',
      name: 'Okres',
      minWidth: 175,
      onRender: (item: Thesis) => (
        <span className={fontStyles}>{props.terms.filter(t => t.id === item.termId)?.shift()?.names.pl}</span>
      )
    },
  ];

  const nothingFound = <p>Nic nie znaleziono.</p>
  const renderResults = (
    <DetailsList 
      selectionMode={SelectionMode.none}
      items={props.theses}
      columns={columns}
    />
  );

  return (
    <Stack className={container} horizontalAlign="center">
      <StackItem className={container}>
        {props.theses.length === 0 ? nothingFound : renderResults}
      </StackItem>
    </Stack>
  )
}

//#region Styles

const container = mergeStyles({
  width: "100%"
});

const fontStyles = mergeStyles({
  fontSize: FontSizes.size14
});

const tokens: IStackTokens = { childrenGap: 5 }

//#endregion Styles
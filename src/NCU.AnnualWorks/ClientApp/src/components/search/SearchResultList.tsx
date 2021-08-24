import { DetailsList, FontSizes, IColumn, IStackTokens, Link, merge, mergeStyles, Persona, PersonaSize, SelectionMode, Stack, StackItem } from '@fluentui/react';
import React from 'react';
import { RouteNames } from '../../shared/Consts';
import { Term, Thesis, User } from '../../shared/Models';

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
      minWidth: 200,
      onRender: (item: Thesis) => (
        <Link href={RouteNames.detailsPath(item.guid)} className={fontStyles}>{item.title}</Link>
      )
    },
    {
      key: 'authors',
      name: 'Autorzy',
      minWidth: 200,
      onRender: (item: Thesis) => (
        <Stack tokens={tokens}>
          {getPersonas(item.thesisAuthors)}
        </Stack>
      )
    },
    {
      key: 'promoter',
      name: 'Promotor',
      minWidth: 200,
      onRender: (item: Thesis) => getPersona(item.promoter)
    },
    {
      key: 'reviewer',
      name: 'Recenzent',
      minWidth: 200,
      onRender: (item: Thesis) => getPersona(item.reviewer)
    },
    {
      key: 'term',
      name: 'Semestr',
      minWidth: 200,
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
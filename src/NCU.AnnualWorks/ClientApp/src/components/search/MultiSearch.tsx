import { Dropdown, IDropdownOption, IStackTokens, mergeStyles, PrimaryButton, Stack, StackItem, TextField } from '@fluentui/react';
import React, { useState } from 'react';
import { Term, Thesis, User } from '../../shared/Models';
import { Api } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { SearchResultList } from './SearchResultList';

interface MultiSearchProps {
  terms: Term[],
  users: User[],
}

export const MultiSearch: React.FC<MultiSearchProps> = (props) => {
  const allTerms = props.terms.map(t => ({ key: t.id, text: t.names.pl }));

  const [searchType, setSearchType] = useState<IDropdownOption>();
  const [searchTerms, setSearchTerms] = useState<IDropdownOption[]>(allTerms);
  const [searchResults, setSearchResults] = useState<Thesis[]>([]);

  //#region Search fields

    //#region Search text field

    const [searchedText, setSearchedText] = useState<string>();
    const searchTextField = (
      <TextField
        value={searchedText}
        onChange={(e, value) => setSearchedText(value)}
        placeholder={"Wyszukaj..."}
      />
    );

    //#endregion Search text field
    
    const getSearchField = () => {
      switch(searchType?.key) {
        case "text":
          return searchTextField;
        case "users":
          return null;
        case "keywords":
          return null;
        default:
          return searchTextField;
      }
    };

  //#endregion Search fields

  //#region Search options

  const searchTypesOptions: IDropdownOption[] = [
    {
      key: "text",
      text: "Tekst",
    },
    {
      key: "users",
      text: "Osoby",
      disabled: true
    },
    {
      key: "keywords",
      text: "Słowa kluczowe",
      disabled: true
    }
  ];

  const searchTermsOptions: IDropdownOption[] = allTerms;

  //#endregion
  
  const onSearch = () => {
    const page = 0;
    const count = 10;

    let query = `page=${page}&count=${count}`;
    query += searchedText ? `&text=${searchedText}` : "";

    Api.get<Thesis[]>(`${AppSettings.API.Theses.Search}?${query}`)
      .then(response => response.data)
      .then(t => setSearchResults(t))
      .catch(error => console.error(error));
  }

  return (
    <>
      <Stack className={container} tokens={tokens} horizontal verticalAlign="center" horizontalAlign="center">
        <StackItem className={searchField} tokens={tokens}>
          {getSearchField()}
        </StackItem>
        <StackItem className={searchOptionField} tokens={tokens}>
          <Dropdown
            options={searchTypesOptions}
            selectedKey={searchType?.key ? searchType.key : undefined}
            defaultSelectedKey={searchTypesOptions[0].key}
            onChange={(e, value) => setSearchType(value)}
          />
        </StackItem>
        <StackItem className={searchOptionField} tokens={tokens}>
          <Dropdown
            options={searchTermsOptions}
            selectedKeys={searchTerms?.map(k => k.key.toString())}
            defaultSelectedKeys={searchTerms?.map(k => k.key.toString())}
            onChange={(e, value) => {
              if(value) {
                setSearchTerms(value.selected ? [...searchTerms, value] : searchTerms.filter(k => k.key !== value.key));
              }
            }}
            multiSelect
          />
        </StackItem>
        <StackItem tokens={tokens}>
          <PrimaryButton onClick={onSearch}>Szukaj</PrimaryButton>
        </StackItem>
      </Stack>
      <Stack className={container} horizontalAlign='center'>
        <SearchResultList theses={searchResults} terms={props.terms} users={props.users} />
      </Stack>
    </>
  );
}

//#region Styles

const tokens: IStackTokens = { childrenGap: 15 };

const container = mergeStyles({
  width: "100%"
});

const searchField = mergeStyles({
  width: "100%"
});

const searchOptionField = mergeStyles({
  width: "325px",
  maxWidth: "325px"
})

//#endregion Styles
import { Dropdown, IDropdownOption, IStackTokens, Label, mergeStyles, PrimaryButton, Stack, StackItem, TextField } from '@fluentui/react';
import React, { useState } from 'react';
import { Term, Thesis, User } from '../../shared/Models';
import { Api } from '../../shared/api/Api';
import { ThesisSearchResponse } from '../../shared/api/models/ThesisSearchResponse';
import { AppSettings } from '../../AppSettings';
import { SearchResultList } from './SearchResultList';
import { Loader } from '../../Components';

interface MultiSearchProps {
  terms: Term[],
  users: User[],
}

export const MultiSearch: React.FC<MultiSearchProps> = (props) => {
  const allTerms = props.terms.map(t => ({ key: t.id, text: t.names.pl }));

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<IDropdownOption>();
  const [searchTerms, setSearchTerms] = useState<IDropdownOption[]>(allTerms);
  const [searchCount, setSearchCount] = useState<string>("10");
  const [searchPage, setSearchPage] = useState<string>("0");
  const [searchResults, setSearchResults] = useState<Thesis[]>([]);
  const [searchResultsCount, setSearchResultsCount] = useState<number>(0);

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

    const getSearchFieldLabel = () => {
      switch(searchType?.key) {
        case "text":
          return "Szukana fraza";
        case "users":
          return "Szukane osoby";
        case "keywords":
          return "Szukane słowa kluczowe";
        default:
          return "Szukana fraza";
      }
    };

  //#endregion Search fields

  //#region Search options

  const searchCountOptions: IDropdownOption[] = [
    {
      key: "5",
      text: "5"
    },
    {
      key: "10",
      text: "10"
    },
    {
      key: "15",
      text: "15"
    },
    {
      key: "20",
      text: "20"
    },
    {
      key: "25",
      text: "25"
    },
    {
      key: "50",
      text: "50"
    }
  ];

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
    setIsSearching(true);

    let query = `page=${searchPage}&count=${searchCount}`;
    query += searchedText ? `&text=${searchedText}` : "";

    Api.get<ThesisSearchResponse>(`${AppSettings.API.Theses.Search}?${query}`)
      .then(response => response.data)
      .then(t => {
        setSearchResults(t.theses);
        setSearchResultsCount(t.itemCount);
        setIsSearching(false);
      })
      .catch(error => {
        console.error(error);
        setIsSearching(false);
      });
  }

  return (
    <>
      <Stack className={container} tokens={tokens} horizontal verticalAlign="end" horizontalAlign="center">
        <StackItem className={searchField} tokens={tokens}>
          <Label>{getSearchFieldLabel()}</Label>
          {getSearchField()}
        </StackItem>
        <StackItem className={searchOptionField} tokens={tokens}>
          <Label>Typ wyszukiwania</Label>
          <Dropdown
            options={searchTypesOptions}
            selectedKey={searchType?.key ? searchType.key : undefined}
            defaultSelectedKey={searchTypesOptions[0].key}
            onChange={(e, value) => setSearchType(value)}
          />
        </StackItem>
        <StackItem className={searchOptionField} tokens={tokens}>
        <Label>Semestry</Label>
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
        <StackItem className={countOptionField} tokens={tokens}>
          <Label>Liczba wyników</Label>
          <Dropdown
            options={searchCountOptions}
            selectedKey={searchCount}
            defaultSelectedKey={"10"}
            onChange={(e, value) => setSearchCount(value?.key.toString() ?? "10")}
          />
        </StackItem>
        <StackItem tokens={tokens}>
          <PrimaryButton onClick={onSearch}>Szukaj</PrimaryButton>
        </StackItem>
      </Stack>
      <Stack className={container} horizontalAlign='center'>
        {isSearching ? <Loader /> : <SearchResultList theses={searchResults} terms={props.terms} users={props.users} />}
      </Stack>
      <Stack className={container} horizontal horizontalAlign="end" tokens={tokens}>
        <Label>Liczba wszystkich wyników: {searchResultsCount}</Label>
        <Label>Liczba stron: {Math.ceil(searchResultsCount / parseInt(searchCount))}</Label>
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
});

const countOptionField = mergeStyles({
  width: "75px",
  maxWidth: "75px"
});

//#endregion Styles
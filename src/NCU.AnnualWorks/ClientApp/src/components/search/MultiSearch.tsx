import { Dropdown, IDropdownOption, IPersonaProps, IStackTokens, ITag, Label, mergeStyles, PrimaryButton, Stack, StackItem, TagPicker, TextField } from '@fluentui/react';
import React, { useState } from 'react';
import { Keyword, Term, Thesis, User } from '../../shared/Models';
import { Api } from '../../shared/api/Api';
import { ThesisSearchResponse } from '../../shared/api/models/ThesisSearchResponse';
import { AppSettings } from '../../AppSettings';
import { SearchResultList } from './SearchResultList';
import { Loader, PeoplePickerWrapper } from '../../Components';
import { SearchPagination } from './SearchPagination';
import { useEffect } from 'react';
import { TagPickerWrapper } from '../shared/TagPicker';
import { mapKeywordsToTags, mapUsersToPersona } from '../../shared/Utils';
import { useHistory } from 'react-router-dom';
import { RouteNames } from '../../shared/Consts';

interface MultiSearchProps {
  terms: Term[],
  users: User[],
  keywords: Keyword[]
}

export const MultiSearch: React.FC<MultiSearchProps> = (props) => {
  const history = useHistory();
  
  const allTerms = props.terms.map(t => ({ key: t.id, text: t.names.pl }));

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<IDropdownOption>();
  const [searchTerms, setSearchTerms] = useState<IDropdownOption[]>(allTerms);
  const [searchCount, setSearchCount] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);
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

    //#region Search keyword field

    const [searchedKeywords, setSearchedKeywords] = useState<ITag[]>([]);
    const searchedKeywordsField = (
      <TagPickerWrapper
        name=""
        label=""
        itemLimit={10}
        tags={mapKeywordsToTags(props.keywords)}
        onChange={(tags) => tags ? setSearchedKeywords(tags) : null}
        selectedTags={searchedKeywords}
      />
    );

    //#endregion Search keyword field

    //#region Search people field

    const [searchedPeople, setSearchedPeople] = useState<IPersonaProps[]>([]);
    const searchedPeopleField = (
      <PeoplePickerWrapper
        name=""
        label=""
        peopleLimit={10}
        people={mapUsersToPersona(props.users)}
        selectedPeople={searchedPeople}
        onChange={(people) => people ? setSearchedPeople(people) : null}
      />
    );

    //#endregion Search people field
    
    const getSearchField = () => {
      switch(searchType?.key) {
        case "text":
          return searchTextField;
        case "users":
          return searchedPeopleField;
        case "keywords":
          return searchedKeywordsField;
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
      key: 5,
      text: "5"
    },
    {
      key: 10,
      text: "10"
    },
    {
      key: 15,
      text: "15"
    },
    {
      key: 20,
      text: "20"
    },
    {
      key: 25,
      text: "25"
    },
    {
      key: 50,
      text: "50"
    },
    {
      key: 100,
      text: "100"
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
    },
    {
      key: "keywords",
      text: "Słowa kluczowe"
    },
    {
      key: "noGrade",
      text: "Prace bez ocen"
    }
  ];

  const searchTermsOptions: IDropdownOption[] = allTerms;

  //#endregion
  
  const onSearch = () => {
    setIsSearching(true);

    let query = `page=${currentPage}&count=${searchCount}`;

    query += searchTerms && searchTerms.length > 0 ? 
      `&terms=${searchTerms.map(t => t.key).reduce((a, b) => `${a};${b}`)}` : "";

    query += searchedText ? `&text=${searchedText}` : "";
    query += searchType?.key === "noGrade" ? `&noGrade=true` : "";
    query += searchType?.key === "keywords" && searchedKeywords.length > 0 ? 
      `&keywords=${searchedKeywords.map(t => t.name).reduce((a, b) => `${a};${b}`)}` : "";
    query += searchType?.key === "users" && searchedPeople.length > 0 ?
      `&users=${searchedPeople.map(p => p.key).reduce((a, b) => `${a};${b}`)}` : "";

    Api.get<ThesisSearchResponse>(`${AppSettings.API.Theses.Search}?${query}`)
      .then(response => response.data)
      .then(t => {
        setSearchResults(t.theses);
        setSearchResultsCount(t.itemCount);
        setIsSearching(false);
      })
      .catch(error => {
        history.push(RouteNames.error);
      });
  }

  useEffect(() => {
    setSearchedPeople([]);
    setSearchedKeywords([]);
    setSearchedText("");
  }, [searchType]);
  
  useEffect(() => {
    setCurrentPage(0);
  }, [searchCount]);

  useEffect(() => {
    if(!isSearching) {
      onSearch();
    }
  }, [currentPage, searchCount]);

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
        <Label>Okresy</Label>
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
          <Label>Wyników na stronę</Label>
          <Dropdown
            options={searchCountOptions}
            selectedKey={searchCount}
            defaultSelectedKey={10}
            onChange={(e, value) => setSearchCount(value?.key ? parseInt(value.key.toString()) : 10)}
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
        <Label>Liczba stron: {Math.ceil(searchResultsCount / searchCount)}</Label>
        <Label>Obecna strona: {currentPage + 1}</Label>
        <SearchPagination currentPage={currentPage} totalPages={Math.ceil(searchResultsCount / searchCount)} setCurrentPage={setCurrentPage} />
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
  width: "100px",
  maxWidth: "100px"
});

//#endregion Styles
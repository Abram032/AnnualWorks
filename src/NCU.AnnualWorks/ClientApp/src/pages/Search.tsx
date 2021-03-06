import React from "react";
import { Stack, IStackTokens, mergeStyles } from "@fluentui/react";
import { useAllTerms, useAllUsers, useCurrentUser, useKeywords } from "../shared/Hooks";
import { Redirect } from "react-router-dom";
import { RouteNames } from "../shared/Consts";
import { Loader } from "../Components";
import { MultiSearch, Tile } from "../components/Index";

export const Search: React.FC = () => {
  const currentUser = useCurrentUser();
  const [allTerms, allTermsIsFetching] = useAllTerms();
  const [allUsers, allUsersIsFetching] = useAllUsers();
  const [allKeywords, allKeywordsIsFetching] = useKeywords();
  
  if(currentUser === null || allTermsIsFetching || allUsersIsFetching || allKeywordsIsFetching) {
    return <Loader />
  }

  if(!currentUser?.isEmployee) {
    return <Redirect to={RouteNames.forbidden} />
  }

  if(!allTerms || !allUsers || !allKeywords) {
    return <Redirect to={RouteNames.error} />
  }

  return (
    <Stack className={container} tokens={stackTokens}>
      <Tile title={"Wyszukiwarka prac"}>
        <MultiSearch 
          terms={allTerms}
          users={allUsers}
          keywords={allKeywords}
        />
      </Tile>
    </Stack>
  );
};

export default Search;

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 15 };

const container = mergeStyles({
  width: "100%"
});


//#endregion
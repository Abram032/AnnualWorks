import React from "react";
import { Label, Stack, FontSizes, IStackTokens } from "@fluentui/react";
import { useCurrentUser } from "../shared/Hooks";
import { Redirect } from "react-router-dom";
import { RouteNames } from "../shared/Consts";

export const Search: React.FC = () => {
  const currentUser = useCurrentUser();

  if(!currentUser?.isEmployee) {
    return <Redirect to={RouteNames.forbidden} />
  }

  return (
    <Stack tokens={stackTokens}>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size24 }}>
          Trwają prace nad funkcjonalnością.
        </Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size24 }}>
          Wkrótce będzie dostępna! 😉
        </Label>
      </Stack.Item>
    </Stack>
  );
};

export default Search;

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 15 };

//#endregion
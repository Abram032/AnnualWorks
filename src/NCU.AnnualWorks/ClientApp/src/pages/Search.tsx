import React from "react";
import { Label, Stack, FontSizes, IStackTokens } from "@fluentui/react";
import { AuthenticatedWrapper } from "../components/Index";

export const Search: React.FC = () => {
  const stackTokens: IStackTokens = { childrenGap: 15 };

  return (
    <AuthenticatedWrapper useLoader>
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
    </AuthenticatedWrapper>
  );
};

export default Search;
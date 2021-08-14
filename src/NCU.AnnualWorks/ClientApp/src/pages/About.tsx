import React from "react";
import { Label, Stack, FontSizes, IStackTokens } from "@fluentui/react";

export const About: React.FC = () => {
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

export default About;

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 15 };

//#endregion
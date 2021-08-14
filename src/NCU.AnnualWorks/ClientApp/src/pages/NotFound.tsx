import React from "react";
import { Label, Stack, FontSizes, IStackTokens } from "@fluentui/react";

export const NotFound: React.FC = () => {
  return (
    <Stack tokens={stackTokens}>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size68 }}>
          404
        </Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size24 }}>
          Not Found
        </Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size24 }}>
          Nie znaleziono zasobu 😢
        </Label>
      </Stack.Item>
    </Stack>
  );
};

export default NotFound;

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 15 };

//#endregion
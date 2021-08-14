import React from "react";
import { Label, Stack, FontSizes, IStackTokens } from "@fluentui/react";

export const Forbidden: React.FC = () => {
  return (
    <Stack tokens={stackTokens}>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size68 }}>
          403
        </Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size24 }}>
          Forbidden
        </Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size24 }}>
          Brak uprawnień do danego zasobu.
        </Label>
      </Stack.Item>
    </Stack>
  );
};

export default Forbidden;

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 15 };

//#endregion

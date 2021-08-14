import React from "react";
import { Label, Stack, FontSizes, IStackTokens } from "@fluentui/react";

export const Error: React.FC = () => {
  return (
    <Stack tokens={stackTokens}>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size68 }}>
          500
        </Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size24 }}>
          Internal Server Error
        </Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size24 }}>
          Wewnętrzny błąd serwera. Spróbuj ponownie późnej. Jeżeli błąd będzie się powtarzał, skontaktuj się z administratorem.
        </Label>
      </Stack.Item>
    </Stack>
  );
};

export default Error;

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 15 };

//#endregion
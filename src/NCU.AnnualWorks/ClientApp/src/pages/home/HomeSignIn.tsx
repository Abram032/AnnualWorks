import React from "react";
import { Label, PrimaryButton, Stack, FontSizes, IStackTokens } from "@fluentui/react";
import { RouteNames } from "../../shared/Consts";

export const HomeSignIn: React.FC = () => {
  return (
    <Stack tokens={stackTokens}>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size24 }}>
          Zaloguj się, aby uzyskać dostęp
        </Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <PrimaryButton href={RouteNames.signIn} >Zaloguj się</PrimaryButton>
      </Stack.Item>
    </Stack>
  );
};

export default HomeSignIn;

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 15 };

//#endregion
import React from "react";
import { Label, PrimaryButton, Stack, FontSizes } from "@fluentui/react";
import { RouteNames } from '../../shared/consts/RouteNames';

export const HomeSignIn: React.FC = () => (
  <Stack>
    <Stack.Item align="center">
      <Label style={{ fontSize: FontSizes.size24 }}>
        Zaloguj się, aby uzyskać dostęp
      </Label>
    </Stack.Item>
    <Stack.Item align="center">
      <PrimaryButton href={RouteNames.signIn}>Zaloguj się</PrimaryButton>
    </Stack.Item>
  </Stack>
);

export default HomeSignIn;
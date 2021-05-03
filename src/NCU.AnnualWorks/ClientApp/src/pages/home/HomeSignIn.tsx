import React from "react";
import { Label, PrimaryButton, Stack, FontSizes } from "@fluentui/react";

export const HomeSignIn: React.FC = () => (
  <Stack>
    <Stack.Item align="center">
      <Label style={{ fontSize: FontSizes.size24 }}>
        Zaloguj się, aby uzyskać dostęp
      </Label>
    </Stack.Item>
    <Stack.Item align="center">
      <PrimaryButton href="/signin">Zaloguj się</PrimaryButton>
    </Stack.Item>
  </Stack>
);

export default HomeSignIn;
import React from "react";
import { Label, PrimaryButton, Stack, FontSizes } from "@fluentui/react";

export const HomeSignUp: React.FC = () => (
  <Stack>
    <Stack.Item align="center">
      <Label style={{ fontSize: FontSizes.size24 }}>
        Dostęp do systemu wymaga rejestracji na zajęcia w systemie USOS
      </Label>
    </Stack.Item>
    <Stack.Item align="center">
      <PrimaryButton href="https://usosweb.umk.pl/kontroler.php?_action=katalog2/przedmioty/pokazPrzedmiot&prz_kod=0800-SEMMGR">Zarejestruj się</PrimaryButton>
    </Stack.Item>
  </Stack>
);

export default HomeSignUp;
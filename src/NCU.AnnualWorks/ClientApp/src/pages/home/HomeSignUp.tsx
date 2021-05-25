import React from "react";
import { Label, PrimaryButton, Stack, FontSizes } from "@fluentui/react";
import { useHistory } from "react-router";

export const HomeSignUp: React.FC = () => {
  const history = useHistory();

  return (
    <Stack>
      <Stack.Item align="center">
        <Label style={{ fontSize: FontSizes.size24 }}>
          Dostęp do systemu wymaga rejestracji na zajęcia w systemie USOS
        </Label>
      </Stack.Item>
      <Stack.Item align="center">
        {/* //TODO: Get url to course code from backend or get the course code and build url to it */}
        <PrimaryButton href="#" onClick={() => history.push('/')}>Zarejestruj się</PrimaryButton>
      </Stack.Item>
    </Stack>
  );
};

export default HomeSignUp;
import React from "react";
import { Label, PrimaryButton, Stack, FontSizes, IStackTokens } from "@fluentui/react";
import { RouteNames } from "../../shared/consts/RouteNames";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

export const HomeSignIn: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const stackTokens: IStackTokens = { childrenGap: 15 };
  return (
    <Stack tokens={stackTokens}>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size24 }}>
          Zaloguj się, aby uzyskać dostęp
        </Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <PrimaryButton 
          //href={RouteNames.signIn} 
          onClick={() => history.push(RouteNames.signIn)}
          >
            {t('signIn')}
          </PrimaryButton>
      </Stack.Item>
    </Stack>
  );
};

export default HomeSignIn;
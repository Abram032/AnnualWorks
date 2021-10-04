import React from "react";
import { Label, PrimaryButton, Stack, FontSizes, IStackTokens } from "@fluentui/react";
import { useCourse } from "../../shared/Hooks";
import { Loader } from "../../Components";
import { RouteNames } from "../../shared/Consts";
import { Redirect } from "react-router-dom";

export const HomeSignUp: React.FC = () => {
  const [course, courseFetching] = useCourse();

  if(courseFetching) {
    return <Loader />
  }

  if(!course) {
    return <Redirect to={RouteNames.error} />
  }

  return (
    <Stack tokens={stackTokens}>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label style={{ fontSize: FontSizes.size24 }}>
          Dostęp do systemu wymaga rejestracji na zajęcia w systemie USOS
        </Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <PrimaryButton href={course?.courseUrl}>Zarejestruj się</PrimaryButton>
      </Stack.Item>
    </Stack>
  );
};

export default HomeSignUp;

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 15 };

//#endregion
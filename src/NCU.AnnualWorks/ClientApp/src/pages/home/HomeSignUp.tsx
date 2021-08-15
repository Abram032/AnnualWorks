import React from "react";
import { Label, PrimaryButton, Stack, FontSizes } from "@fluentui/react";
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
    <Stack>
      <Stack.Item align="center">
        <Label style={{ fontSize: FontSizes.size24 }}>
          Dostęp do systemu wymaga rejestracji na zajęcia w systemie USOS
        </Label>
      </Stack.Item>
      <Stack.Item align="center">
        <PrimaryButton href={course?.courseUrl}>Zarejestruj się</PrimaryButton>
      </Stack.Item>
    </Stack>
  );
};

export default HomeSignUp;
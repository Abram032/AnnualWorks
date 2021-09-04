import { ILinkProps, Link as FluentLink, mergeStyles } from '@fluentui/react';
import React from 'react';
import { CookieNames, ThemeNames } from "../../shared/Consts";
import { useCookies } from "react-cookie";

export const Link: React.FC<ILinkProps> = (props) => {
  const [cookies] = useCookies([CookieNames.theme]);
  const themeName = cookies[CookieNames.theme];

  let highAvailablilityStyles = mergeStyles(props.className);
  if(themeName === ThemeNames.darkHighContrast || themeName === ThemeNames.lightHighContrast) {
    highAvailablilityStyles = mergeStyles(props.className, {
      textDecoration: "underline!important"
    });
  }

  return (
    <FluentLink {...props} className={highAvailablilityStyles}>
      {props.children}
    </FluentLink>
  );
};
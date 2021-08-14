import React from 'react';
import { mergeStyles, useTheme } from '@fluentui/react';

export const Main: React.FC = (props) => {
  const theme = useTheme();

  //#region Styles

  const style = mergeStyles({
    backgroundColor: theme.palette.neutralLighterAlt
  })

  //#endregion
  
  return (
    <main className={style}>
      {props.children}
    </main>
  );
}

export default Main;
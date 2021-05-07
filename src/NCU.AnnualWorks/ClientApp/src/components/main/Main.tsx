import { mergeStyles, useTheme } from '@fluentui/react';
import React from 'react';

export const Main: React.FC = (props) => {
  const theme = useTheme();

  const style = mergeStyles({
    backgroundColor: theme.palette.neutralLighterAlt
  })
  
  return (
    <main className={style}>
      {props.children}
    </main>
  );
}

export default Main;
import { useTheme } from '@fluentui/react';
import React from 'react';

export const Main: React.FC = (props) => {
  const theme = useTheme();
  
  return (
    <main style={{ backgroundColor: theme.palette.neutralLighterAlt }}>
      {props.children}
    </main>
  );
}

export default Main;
import React from 'react';
import { Separator, useTheme } from '@fluentui/react';

export const NavSeparator: React.FC = () => {
  const theme = useTheme();
  const styles = {
    root: [
      {
        selectors: {
          ":after": {
            background: theme.palette.neutralPrimary,
          },
        },
      },
    ],
  };

  return (
    <Separator className="nav-separator" styles={styles} vertical />
  )
}

export default NavSeparator;
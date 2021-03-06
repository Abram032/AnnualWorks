import React from 'react';
import { Separator, useTheme } from '@fluentui/react';

export const NavSeparator: React.FC = () => {
  const theme = useTheme();

  //#region Styles

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

  //#endregion

  return (
    <Separator className="nav-separator" styles={styles} vertical />
  )
}

export default NavSeparator;
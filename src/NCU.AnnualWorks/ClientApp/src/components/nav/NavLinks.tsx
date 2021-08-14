import React from "react";
import { IStackTokens, Stack } from "@fluentui/react";

export const NavLinks: React.FC = (props) => {
  return (
    <Stack className='nav-links' tokens={stackTokens} horizontal>
      {props.children}
    </Stack>
  );
};

export default NavLinks;

  //#region Styles

  const stackTokens: IStackTokens = { childrenGap: 50 }

  //#endregion
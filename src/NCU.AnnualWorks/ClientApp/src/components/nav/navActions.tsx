import React from "react";
import { IStackTokens, Stack } from "@fluentui/react";

export const NavActions: React.FC = (props) => {
  const stackTokens: IStackTokens = { childrenGap: 15 }
  
  return (
    <Stack className="nav-actions" horizontal tokens={stackTokens}>
      {props.children}
    </Stack>
  );
};

export default NavActions;

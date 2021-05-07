import React from "react";
import { IStackTokens, Stack } from "@fluentui/react";

export const NavActions: React.FC = (props) => {
  // const children = React.Children.map(props.children, (child) => (
  //   <Stack.Item>{child}</Stack.Item>
  // ));
  const stackTokens: IStackTokens = { childrenGap: 15 }
  return (
    <Stack className="nav-actions" horizontal>
      {props.children}
    </Stack>
  );
};

export default NavActions;

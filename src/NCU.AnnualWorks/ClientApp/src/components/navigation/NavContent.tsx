import React from "react";
import { Stack } from "@fluentui/react";

export const NavContent: React.FC = (props) => {
  const children = React.Children.map(props.children, (child) => (
    <Stack.Item>{child}</Stack.Item>
  ));

  return (
    <Stack className="nav-content" horizontal>
      {children}
    </Stack>
  );
};

export default NavContent;

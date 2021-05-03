import { Stack } from "@fluentui/react";
import React from "react";

export const FooterContent: React.FC = (props) => {
  const children = React.Children.map(props.children, (child) => (
    <Stack.Item>{child}</Stack.Item>
  ));

  return (
    <Stack className="footer-content" horizontal>
      {children}
    </Stack>
  );
};

export default FooterContent;

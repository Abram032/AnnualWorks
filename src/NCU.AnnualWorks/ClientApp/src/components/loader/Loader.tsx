import { Spinner, Stack } from "@fluentui/react";
import React from "react";

interface LoaderProps {
  label?: string;
  labelPosition?: "bottom" | "left" | "right" | "top";
  size: "huge" | "large" | "medium" | "small";
}

export const Loader: React.FC<LoaderProps> = (props) => (
  <Stack>
    <Spinner
      label={props.label ?? ""}
      labelPosition={props.labelPosition ?? "bottom"}
      className={`loader ${props.size}`}
    />
  </Stack>
);

export default Loader;

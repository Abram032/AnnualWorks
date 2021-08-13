import React from "react";
import { Spinner, Stack } from "@fluentui/react";

interface LoaderProps {
  label?: string;
  labelPosition?: "bottom" | "left" | "right" | "top";
  size?: "huge" | "large" | "medium" | "small";
}

export const Loader: React.FC<LoaderProps> = (props) => (
  <Stack>
    <Spinner
      label={props.label ?? "Ładowanie..."}
      labelPosition={props.labelPosition ?? "bottom"}
      className={`loader ${props.size ?? "medium"}`}
    />
  </Stack>
);

export default Loader;

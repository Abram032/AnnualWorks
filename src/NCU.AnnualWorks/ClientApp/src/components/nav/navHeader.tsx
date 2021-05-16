import { Stack, StackItem } from "@fluentui/react";
import React from "react";
import NavSeparator from "./navSeparator";
import NavHeaderLink from "./navHeaderLink";

interface NavHeaderProps {
  primaryLabel: string;
  secondarylabel: string;
  primaryHref: string;
  secondaryHref: string;
}

export const NavHeader: React.FC<NavHeaderProps> = (props) => {
  return (
    <Stack className="nav-header" horizontal>
      <StackItem className="nav-header-title primary">
        <NavHeaderLink label={props.primaryLabel} href={props.primaryHref} />
      </StackItem>
      <NavSeparator />
      <StackItem className="nav-header-title secondary">
        <NavHeaderLink label={props.secondarylabel} href={props.secondaryHref} />
      </StackItem>
    </Stack>
  );
};

export default NavHeader;

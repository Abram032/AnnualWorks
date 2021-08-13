import { Stack, StackItem } from "@fluentui/react";
import React from "react";
import NavSeparator from "./NavSeparator";
import NavHeaderLink from "./NavHeaderLink";

interface NavHeaderProps {
  primaryLabel: string;
  secondarylabel: string;
  primaryOnClick?: () => void;
  primaryHref: string;
  secondaryHref: string;
  secondaryOnClick?: () => void
}

export const NavHeader: React.FC<NavHeaderProps> = (props) => {
  return (
    <Stack className="nav-header" horizontal>
      <StackItem className="nav-header-title primary">
        <NavHeaderLink label={props.primaryLabel} href={props.primaryHref} onClick={props.primaryOnClick}/>
      </StackItem>
      <NavSeparator />
      <StackItem className="nav-header-title secondary">
        <NavHeaderLink label={props.secondarylabel} href={props.secondaryHref} onClick={props.secondaryOnClick}/>
      </StackItem>
    </Stack>
  );
};

export default NavHeader;

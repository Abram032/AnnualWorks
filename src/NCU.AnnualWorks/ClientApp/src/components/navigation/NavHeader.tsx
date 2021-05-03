import { Stack } from "@fluentui/react";
import React from "react";
import NavSeparator from "./NavSeparator";
import NavHeaderLink from "./NavHeaderLink";

interface NavHeaderProps {
  primaryLabel: string;
  secondarylabel: string;
  primaryHref: string;
  secondaryHref: string;
}

export const NavHeader: React.FC<NavHeaderProps> = (props) => {
  return (
    <Stack className="nav-header" horizontal>
      <Stack.Item className="nav-header-title primary">
        <NavHeaderLink label={props.primaryLabel} href={props.primaryHref} />
      </Stack.Item>
      <NavSeparator />
      <Stack.Item className="nav-header-title secondary">
        <NavHeaderLink label={props.secondarylabel} href={props.secondaryHref} />
      </Stack.Item>
    </Stack>
  );
};

export default NavHeader;

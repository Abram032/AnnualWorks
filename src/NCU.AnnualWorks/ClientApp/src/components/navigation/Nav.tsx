import React from "react";
import { Stack } from "@fluentui/react";
import NavHeader from "./NavHeader";
import NavContent from "./NavContent";
import NavContentLink from "./NavContentLink";

export const Nav: React.FC = () => (
  <Stack className="nav" horizontal>
    <NavHeader
      primaryLabel="Instytut Psychologii"
      primaryHref="http://psychologia.umk.pl/"
      secondarylabel="Prace roczne"
      secondaryHref="/"
    />
    <NavContent>
      <NavContentLink label="Zaloguj się" href="/signin" />
    </NavContent>
  </Stack>
);

export default Nav;

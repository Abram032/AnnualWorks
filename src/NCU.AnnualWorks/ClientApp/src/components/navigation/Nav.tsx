import React, { useContext } from "react";
import { Stack } from "@fluentui/react";
import NavHeader from "./NavHeader";
import NavContent from "./NavContent";
import NavContentLink from "./NavContentLink";
import { AuthenticationContext } from "../../shared/providers/AuthenticationProvider";
import User from "../../shared/models/User";
import MeControl from '../me/MeControl';

//TODO: Clean up, move to env addresses

export const Nav: React.FC = () => {
  const user = useContext<User | null | undefined>(AuthenticationContext);

  const content = !user ? 
    <NavContentLink label="Zaloguj się" href="/signin" /> :
    <MeControl user={user} />

  return (
    <Stack className="nav" horizontal>
    <NavHeader
      primaryLabel="Instytut Psychologii"
      primaryHref="http://psychologia.umk.pl/"
      secondarylabel="Prace roczne"
      secondaryHref="/"
    />
    <NavContent>
      {content}
    </NavContent>
  </Stack>
  )
};

export default Nav;

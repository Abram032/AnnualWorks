import React, { useContext } from "react";
import { Stack } from "@fluentui/react";
import NavHeader from "./NavHeader";
import NavContent from "./NavContent";
import NavContentLink from "./NavContentLink";
import { AuthenticationContext } from "../../shared/providers/AuthenticationProvider";
import MeControl from '../me/MeControl';
import { AppSettings } from '../../AppSettings';
import { RouteNames } from '../../shared/consts/RouteNames';

//TODO: Clean up, move to env addresses

export const Nav: React.FC = () => {
  const authContext = useContext(AuthenticationContext);

  const content = !authContext.isAuthenticated || !authContext.user ? 
    <NavContentLink label="Zaloguj się" href={RouteNames.signIn} /> :
    <MeControl user={authContext.user} />

  return (
    <Stack className="nav" horizontal>
    <NavHeader
      primaryLabel="Instytut Psychologii"
      primaryHref={AppSettings.Urls.InstituteOfPsychology}
      secondarylabel="Prace roczne"
      secondaryHref={RouteNames.root}
    />
    <NavContent>
      {content}
    </NavContent>
  </Stack>
  )
};

export default Nav;

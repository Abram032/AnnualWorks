import React, { useContext } from "react";
import { Stack } from "@fluentui/react";
import NavHeader from "./navHeader";
import NavActions from "./navActions";
import NavLink from "./navLink";
import { AuthenticationContext } from "../../shared/providers/AuthenticationProvider";
import MeControl from "../meControl/meControl";
import { AppSettings } from "../../AppSettings";
import { RouteNames } from "../../shared/consts/RouteNames";
import NavLinks from "./navLinks";

//TODO: Clean up, move to env addresses

export const Nav: React.FC = () => {
  const authContext = useContext(AuthenticationContext);

  const actions =
    !authContext.isAuthenticated || !authContext.user ? (
      <NavLink label="Zaloguj się" href={RouteNames.signIn} />
    ) : (
      <MeControl user={authContext.user} />
    );

  const links =
    !authContext.isAuthenticated || !authContext.user ? null : (
      <>
        <NavLink label="Wyszukiwanie prac" href="#" />
        <NavLink label="Dodaj pracę" href="/add-thesis" />
      </>
    );

  return (
    <Stack className="nav" horizontal>
      <NavHeader
        primaryLabel="Instytut Psychologii"
        primaryHref={AppSettings.Urls.InstituteOfPsychology}
        secondarylabel="Prace roczne"
        secondaryHref={RouteNames.root}
      />
      <NavLinks>{links}</NavLinks>
      <NavActions>{actions}</NavActions>
    </Stack>
  );
};

export default Nav;
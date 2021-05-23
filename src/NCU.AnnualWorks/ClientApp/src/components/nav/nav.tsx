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
import { Route, useHistory } from "react-router";

//TODO: Clean up, move to env addresses
//TODO: Fix links and routes with useHistory()
export const Nav: React.FC = () => {
  const authContext = useContext(AuthenticationContext);
  const history = useHistory();

  const actions =
    !authContext.isAuthenticated || !authContext.currentUser ? (
      <NavLink label="Zaloguj się" href={RouteNames.signIn} onClick={() => history.push(RouteNames.signIn)}/>
    ) : (
      <MeControl user={authContext.currentUser} />
    );

  const searchTheses =
    !authContext.isAuthenticated || !authContext.currentUser ? null : (
        <NavLink label="Wyszukiwanie prac" href={RouteNames.search} onClick={() => history.push(RouteNames.search)} />
    );
  const addThesis = !authContext.isAuthenticated || !authContext.currentUser || !authContext.currentUser.isLecturer ? null : (
    <NavLink label="Dodaj pracę" href={RouteNames.addThesis} onClick={() => history.push(RouteNames.addThesis)} />
  )

  const links = (
    <>
      {searchTheses}
      {addThesis}
    </>
  )

  return (
    <Stack className="nav" horizontal>
      <NavHeader
        primaryLabel="Instytut Psychologii"
        primaryHref={AppSettings.Urls.InstituteOfPsychology}
        secondarylabel="Prace roczne"
        secondaryHref={RouteNames.root}
        secondaryOnClick={() => history.push(RouteNames.root)}
      />
      <NavLinks>{links}</NavLinks>
      <NavActions>{actions}</NavActions>
    </Stack>
  );
};

export default Nav;

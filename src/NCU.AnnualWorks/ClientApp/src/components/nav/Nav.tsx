import React, { useContext } from "react";
import { Stack } from "@fluentui/react";
import NavHeader from "./NavHeader";
import NavActions from "./NavActions";
import NavLink from "./NavLink";
import { AuthenticationContext } from "../../shared/providers/AuthenticationProvider";
import MeControl from "../meControl/MeControl";
import { AppSettings } from "../../AppSettings";
import { RouteNames } from "../../shared/consts/RouteNames";
import NavLinks from "./NavLinks";
import { Route, useHistory } from "react-router";
import { useDeadline } from "../../shared/hooks/DeadlineHooks";

//TODO: Clean up, move to env addresses
//TODO: Fix links and routes with useHistory()
export const Nav: React.FC = () => {
  const authContext = useContext(AuthenticationContext);
  const history = useHistory();
  const deadline = useDeadline();

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
  const addThesis = !authContext.isAuthenticated || 
    !authContext.currentUser || 
    !authContext.currentUser.isLecturer || 
    (deadline && deadline < new Date()) ? null : (
    <NavLink label="Dodaj pracę" href={RouteNames.addThesis} onClick={() => history.push(RouteNames.addThesis)} />
  )
  const adminPanel = !authContext.isAuthenticated || !authContext.currentUser || !authContext.currentUser.isAdmin ? null : (
    <NavLink label="Panel administracyjny" href={RouteNames.adminPanel} onClick={() => history.push(RouteNames.adminPanel)} />
  );

  const links = (
    <>
      {searchTheses}
      {addThesis}
      {adminPanel}
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
import React from "react";
import { Stack } from "@fluentui/react";
import { MeControl, NavHeader, NavActions, NavLink, NavLinks } from "../Components";
import { AppSettings } from "../AppSettings";
import { RouteNames } from "../shared/Consts";
import { useHistory } from "react-router";
import { useCurrentUser, useDeadline, useIsAuthenticated } from "../shared/Hooks";

export const Nav: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();
  const history = useHistory();
  const [deadline, deadlineFetching] = useDeadline();

  const actions = isAuthenticated && currentUser ?
    <MeControl user={currentUser!} /> :
    <NavLink label="Zaloguj się" href={RouteNames.signIn} />;

  const searchTheses = isAuthenticated && currentUser?.isEmployee ?
    <NavLink label="Wyszukiwanie prac" href={RouteNames.search} /> : null;

  const addThesis = isAuthenticated && currentUser?.isLecturer && deadline && deadline > new Date() ?
    <NavLink label="Dodaj pracę" href={RouteNames.addThesis} /> : null;

  const adminPanel = isAuthenticated && currentUser?.isAdmin ?
    <NavLink label="Panel administracyjny" href={RouteNames.adminPanel} /> : null;

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

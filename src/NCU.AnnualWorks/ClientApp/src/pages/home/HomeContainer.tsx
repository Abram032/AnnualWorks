import React from "react";
import HomeSignIn from "./HomeSignIn";
import HomeSignUp from "./HomeSignUp";
import Home from "./Home";
import { Loader } from '../../Components';
import { useCurrentUser, useIsAuthenticated } from "../../shared/Hooks";

export const HomeContainer: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();
  const hasAccess = currentUser?.isParticipant || 
    currentUser?.isLecturer || 
    currentUser?.isCustom || 
    currentUser?.isAdmin;
    
  if(isAuthenticated === null) {
    return <Loader label={'Ładowanie...'} size='medium' />
  } 

  if(!isAuthenticated) {
    return <HomeSignIn />
  }
  else if(!hasAccess) {
    return <HomeSignUp />
  }
  else {
    return <Home />
  }
};

export default HomeContainer;

import React, { useContext } from "react";
import { AuthenticationContext } from '../../shared/providers/AuthenticationProvider';
import HomeSignIn from "./HomeSignIn";
import HomeSignUp from "./HomeSignUp";
import Home from "./Home";
import { Loader } from '../../Components';

export const HomeContainer: React.FC = () => {
  const authContext = useContext(AuthenticationContext);
  const currentUser = authContext.currentUser;
  const hasAccess = currentUser?.isParticipant || 
    currentUser?.isLecturer || 
    currentUser?.isAdmin || 
    currentUser?.isAdmin;
    
  if(authContext.isFetching) {
    return <Loader label={'Ładowanie...'} size='medium' />
  } 
  else if(!authContext.isAuthenticated) {
    return <HomeSignIn />
  }
  else if(!hasAccess || !authContext.isAuthenticated) {
    return <HomeSignUp />
  }
  else {
    return <Home />
  }
};

export default HomeContainer;

import React, { useContext } from "react";
import { AuthenticationContext } from '../../shared/providers/AuthenticationProvider';
import HomeSignIn from "./homeSignIn";
import HomeSignUp from "./homeSignUp";
import Home from "./home";
import Loader from "../../components/loader/loader";

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

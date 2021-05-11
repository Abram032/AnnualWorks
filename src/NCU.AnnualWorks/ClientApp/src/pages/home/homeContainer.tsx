import React, { useContext } from "react";
import { AuthenticationContext } from '../../shared/providers/AuthenticationProvider';
import { AccessTypes } from '../../shared/models/AccessType';
import HomeSignIn from "./homeSignIn";
import HomeSignUp from "./homeSignUp";
import Home from "./home";
import Loader from "../../components/loader/loader";

export const HomeContainer: React.FC = () => {
  const authContext = useContext(AuthenticationContext);

  if(authContext.isFetching) {
    return <Loader size='medium' />
  } 
  else if(!authContext.isAuthenticated) {
    return <HomeSignIn />
  }
  else if(authContext.isAuthenticated && authContext.user?.accessType === AccessTypes.Unknown) {
    return <HomeSignUp />
  }
  else {
    return <Home />
  }
};

export default HomeContainer;
import React, { useContext } from "react";
import { AuthenticationContext } from '../shared/providers/AuthenticationProvider';
import { AccessTypes } from '../shared/models/AccessType';
import HomeSignIn from "./home/HomeSignIn";
import HomeSignUp from "./home/HomeSignUp";
import Home from "./home/Home";
import Loader from "../components/loader/Loader";

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

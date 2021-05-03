import React, { useContext, useEffect } from "react";
import { Label, PrimaryButton, Stack, FontSizes } from "@fluentui/react";
import { AuthenticationContext } from '../shared/providers/AuthenticationProvider';
import User from "../shared/models/User";
import HomeSignIn from "./home/HomeSignIn";
import HomeSignUp from "./home/HomeSignUp";
import Home from "./home/Home";
import Loader from "../components/loader/Loader";

//TODO: Clean up

export const HomeContainer: React.FC = () => {
  const user = useContext<User | null | undefined>(AuthenticationContext);

  if(user === undefined) {
    return <Loader size='medium' />
  } 
  else if(user === null) {
    return <HomeSignIn />
  }
  else if(user && user.accessType === 'Unknown') {
    return <HomeSignUp />
  }
  else {
    return <Home />
  }
};

export default HomeContainer;

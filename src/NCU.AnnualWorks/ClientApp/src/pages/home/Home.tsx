import React, { useContext } from "react";
import { Label, PrimaryButton, Stack, FontSizes } from "@fluentui/react";
import { AuthenticationContext } from '../../shared/providers/AuthenticationProvider';
import User from "../../shared/models/User";

export const Home: React.FC = () => {
  const user = useContext(AuthenticationContext);
  
  return (
    <></>
  );
};

export default Home;

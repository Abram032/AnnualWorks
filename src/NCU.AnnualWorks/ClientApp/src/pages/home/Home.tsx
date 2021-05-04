import React, { useContext } from "react";
import { AuthenticationContext } from '../../shared/providers/AuthenticationProvider';
import { AppSettings } from '../../AppSettings';

export const Home: React.FC = () => {
  const authContext = useContext(AuthenticationContext);
  
  return (
    <>
      
    </>
  );
};

export default Home;

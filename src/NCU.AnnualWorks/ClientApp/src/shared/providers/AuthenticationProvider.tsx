import React, { useEffect, useState } from 'react';
import User from '../models/User';
import UserData from '../models/UserData';
import { userCookieName } from '../consts/cookieNames';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';

//TODO: Clean up move to separate props User / isAuthenticated / isFetching

export const AuthenticationContext = React.createContext<User | null | undefined>(undefined);

export const AuthenticationProvider: React.FC = (props) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [cookies] = useCookies([userCookieName]);

  useEffect(() => {
    const userToken = cookies[userCookieName];
    try
    {
      const userData = jwtDecode<UserData>(userToken);
      setUser({
        id: userData.Id,
        name: userData.Name,
        avatarUrl: userData.AvatarUrl,
        accessType: userData.AccessType,
        email: userData.Email
      })
    }
    catch
    {
      setUser(null);
    }
  }, [cookies])

  return (
    <AuthenticationContext.Provider
      value={user}
    >
      {props.children}
    </AuthenticationContext.Provider>
  )
};

export default AuthenticationProvider;
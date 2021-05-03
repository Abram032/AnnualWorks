import React, { useEffect, useState } from 'react';
import User from '../models/User';
import UserData from '../models/UserData';
import { CookieNames } from '../consts/CookieNames';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';

interface IAuthenticationContext {
  user: User | null,
  isAuthenticated: boolean,
  isFetching: boolean
}

export const AuthenticationContext = React.createContext<IAuthenticationContext>({
  user: null,
  isAuthenticated: false,
  isFetching: true
});

export const AuthenticationProvider: React.FC = (props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [cookies] = useCookies([CookieNames.user]);

  useEffect(() => {
    const userToken = cookies[CookieNames.user];
    try
    {
      const userData = jwtDecode<UserData>(userToken);
      setUser({
        id: userData.Id,
        name: userData.Name,
        avatarUrl: userData.AvatarUrl,
        accessType: userData.AccessType,
        email: userData.Email
      });
      setIsAuthenticated(true);
      setIsFetching(false);
    }
    catch
    {
      setIsAuthenticated(false);
      setIsFetching(false);
      setUser(null);
    }
  }, [cookies])

  return (
    <AuthenticationContext.Provider
      value={{
        user: user,
        isAuthenticated: isAuthenticated,
        isFetching: isFetching
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  )
};

export default AuthenticationProvider;
import React, { useEffect, useState } from 'react';
import CurrentUser from '../models/Auth/CurrentUser';
import UserClaims from '../models/Auth/UserClaims';
import { CookieNames } from '../consts/CookieNames';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';

interface IAuthenticationContext {
  currentUser: CurrentUser | null,
  isAuthenticated: boolean,
  isFetching: boolean
}

export const AuthenticationContext = React.createContext<IAuthenticationContext>({
  currentUser: null,
  isAuthenticated: false,
  isFetching: true
});

export const AuthenticationProvider: React.FC = (props) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [cookies] = useCookies([CookieNames.user]);

  useEffect(() => {
    const userToken = cookies[CookieNames.user];
    try
    {
      const userClaims = jwtDecode<UserClaims>(userToken);
      setCurrentUser({
        id: userClaims.Id,
        name: userClaims.Name,
        avatarUrl: userClaims.AvatarUrl,
        accessType: userClaims.AccessType,
        email: userClaims.Email
      });
      setIsAuthenticated(true);
      setIsFetching(false);
    }
    catch
    {
      setIsAuthenticated(false);
      setIsFetching(false);
      setCurrentUser(null);
    }
  }, [cookies])

  return (
    <AuthenticationContext.Provider
      value={{
        currentUser: currentUser,
        isAuthenticated: isAuthenticated,
        isFetching: isFetching
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  )
};

export default AuthenticationProvider;
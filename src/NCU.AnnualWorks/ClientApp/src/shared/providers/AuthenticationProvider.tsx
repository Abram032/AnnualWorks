import React, { useEffect, useState } from 'react';
import { CurrentUser, UserClaims } from '../Models';
import { CookieNames } from '../Consts';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';

interface IAuthenticationContext {
  currentUser?: CurrentUser,
  isAuthenticated: boolean,
  isFetching: boolean
}

export const AuthenticationContext = React.createContext<IAuthenticationContext>({
  isAuthenticated: false,
  isFetching: true
});

export const AuthenticationProvider: React.FC = (props) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [cookies] = useCookies([CookieNames.user]);

  useEffect(() => {
    const userToken = cookies[CookieNames.user];
    try {
      const userClaims = jwtDecode<UserClaims>(userToken);
      
      const isParticipant = (userClaims.IsParticipant.toLowerCase() === 'true');
      const isLecturer = (userClaims.IsLecturer.toLowerCase() === 'true');
      const isAdmin = (userClaims.IsAdmin.toLowerCase() === 'true');
      const isCustom = (userClaims.IsCustom.toLowerCase() === 'true');
      const isEmployee = isLecturer || isCustom || isAdmin;

      setCurrentUser({
        id: userClaims.Id,
        name: userClaims.Name,
        avatarUrl: userClaims.AvatarUrl,
        isParticipant: isParticipant,
        isLecturer: isLecturer,
        isAdmin: isAdmin,
        isCustom: isCustom,
        isEmployee: isEmployee,
        email: userClaims.Email,
      });
      setIsAuthenticated(!!userClaims.Id);
      setIsFetching(false);
    }
    catch
    {
      setCurrentUser(undefined);
      setIsAuthenticated(false);
      setIsFetching(false);
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
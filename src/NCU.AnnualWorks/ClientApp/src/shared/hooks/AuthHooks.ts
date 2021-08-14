import { useContext, useEffect, useState } from 'react';
import { CurrentUser } from '../Models';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

export const useIsAuthenticated = (): boolean | null => {
  const authContext = useContext(AuthenticationContext);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!authContext.isFetching) {
      authContext.isAuthenticated ? setIsAuthenticated(true) : setIsAuthenticated(false);
    }
  }, [authContext.isAuthenticated, authContext.isFetching]);

  return isAuthenticated;
}

export const useCurrentUser = (): CurrentUser | null => {
  const authContext = useContext(AuthenticationContext);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (!authContext.isFetching) {
      authContext.currentUser ? setCurrentUser(authContext.currentUser) : setCurrentUser(null);
    }
  }, [authContext.currentUser, authContext.isFetching]);

  return currentUser;
}
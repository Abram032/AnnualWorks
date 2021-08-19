import React from 'react';
import { useCurrentUser, useIsAuthenticated } from '../../shared/Hooks';
import { Loader } from '../../Components';
import { Redirect } from 'react-router-dom';
import { RouteNames } from '../../shared/Consts';

interface AuthenticatedWrapper {
  useLoader?: boolean;
}

export const AuthenticatedWrapper: React.FC<AuthenticatedWrapper> = (props) => {
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();

  if (isAuthenticated === null) {
    return !props.useLoader ? null : <Loader />;
  }

  if (!isAuthenticated) {
    return <Redirect to={RouteNames.signIn} />
  }

  if(!currentUser?.isEmployee && !currentUser?.isParticipant) {
    return <Redirect to={RouteNames.forbidden} />
  }

  return (
    <>
      {props.children}
    </>
  );
};
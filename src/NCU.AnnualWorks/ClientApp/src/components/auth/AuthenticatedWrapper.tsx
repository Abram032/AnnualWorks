import React from 'react';
import { useIsAuthenticated } from '../../shared/Hooks';
import { Loader } from '../../Components';
import { Redirect } from 'react-router-dom';
import { RouteNames } from '../../shared/Consts';

interface AuthenticatedWrapper {
  useLoader?: boolean;
}

export const AuthenticatedWrapper: React.FC<AuthenticatedWrapper> = (props) => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated === null) {
    return !props.useLoader ? null : <Loader />;
  }

  if (!isAuthenticated) {
    return <Redirect to={RouteNames.signIn} />
  }

  return (
    <>
      {props.children}
    </>
  );
};
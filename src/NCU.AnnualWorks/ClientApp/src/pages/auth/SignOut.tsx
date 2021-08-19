import React, { useEffect } from 'react';
import { Loader } from '../../Components';
import { AppSettings } from '../../AppSettings';
import { Api } from '../../shared/api/Api';
import { RouteNames } from '../../shared/Consts';
import { useHistory } from 'react-router-dom';

export const SignOut: React.FC = () => {
  const history = useHistory();
  //TODO: Move to api
  useEffect(() => {
    Api.post(AppSettings.API.Auth.SignOut)
      .then(response => {
        window.location.href = response.data;
      })
      .catch(error => {
        console.log(error);
        history.push(RouteNames.error);
      });
  }, [])

  return <Loader size='medium' label='Wylogowywanie...' />
}

export default SignOut;
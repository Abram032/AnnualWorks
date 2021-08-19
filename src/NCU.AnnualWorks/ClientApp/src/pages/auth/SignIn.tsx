import React, { useEffect } from 'react';
import { Loader } from '../../Components';
import { AppSettings } from '../../AppSettings';
import { Api } from '../../shared/api/Api';
import { useHistory } from 'react-router-dom';
import { RouteNames } from '../../shared/Consts';

export const SignIn: React.FC = () => {
  const history = useHistory();
  //TODO: Move to api
  useEffect(() => {
    Api.post(AppSettings.API.Auth.Authenticate)
      .then(response => {
        window.location.href = response.data;
      }).catch(error => {
        console.log(error);
        history.push(RouteNames.error);
      });
  }, []);

  return <Loader size='medium' label='Łączenie z systemem USOS...' />
}

export default SignIn;
import React, { useEffect } from 'react';
import { Loader } from '../../Components';
import { AppSettings } from '../../AppSettings';
import { useApi } from '../../shared/api/Api';

export const SignIn: React.FC = () => {
  const api = useApi();
  //TODO: Move to api
  useEffect(() => {
    api.post(AppSettings.API.Auth.Authenticate)
      .then(response => {
        window.location.href = response.data;
      }).catch(error => console.log(error));
  }, []);

  return <Loader size='medium' label='Łączenie z systemem USOS...' />
}

export default SignIn;
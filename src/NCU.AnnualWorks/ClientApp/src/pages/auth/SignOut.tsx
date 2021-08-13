import React, { useEffect } from 'react';
import Loader from '../../components/Loader';
import { AppSettings } from '../../AppSettings';
import { useApi } from '../../shared/api/Api';

export const Login: React.FC = () =>
{
    const api = useApi();
  //TODO: Move to api
    useEffect(() => {
        api.post(AppSettings.API.Auth.SignOut)
        .then(response => {
            window.location.href = response.data;
        })
        .catch(error => console.log(error));
    }, [])

    return <Loader size='medium' label='Wylogowywanie...'/>
}

export default Login;
import React, { useEffect } from 'react';
import Loader from '../../components/loader/loader';
import { AppSettings } from '../../AppSettings';
import Api from '../../shared/api/Api';

export const Login: React.FC = () =>
{
  //TODO: Move to api
    useEffect(() => {
        Api.post(AppSettings.API.Auth.SignOut)
        .then(response => {
            window.location.href = response.data;
        })
        .catch(error => console.log(error));
    }, [])

    return <Loader size='medium' label='Wylogowywanie...'/>
}

export default Login;
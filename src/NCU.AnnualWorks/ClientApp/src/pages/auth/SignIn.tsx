import React, { useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/loader/Loader';
import { AppSettings } from '../../AppSettings';

export const Login: React.FC = () =>
{
    //TODO: Move to api
    useEffect(() => {
        axios.post(AppSettings.API.Auth.Authenticate)
        .then(response => {
            window.location.href = response.data;
            console.log(response);
        })
        .catch(error => console.log(error));
    }, [])

    return <Loader size='medium' label='Łączenie z systemem USOS...'/>
}

export default Login;
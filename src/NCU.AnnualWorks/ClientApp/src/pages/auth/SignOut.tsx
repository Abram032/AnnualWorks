import React, { useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/loader/Loader';

export const Login: React.FC = () =>
{
  //TODO: Move to api
    useEffect(() => {
        axios.post('/api/auth/signout')
        .then(response => {
            window.location.href = response.data;
            console.log(response);
        })
        .catch(error => console.log(error));
    }, [])

    return <Loader size='medium' label='Wylogowywanie...'/>
}

export default Login;
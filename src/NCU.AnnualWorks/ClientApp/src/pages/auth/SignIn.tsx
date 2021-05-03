import React, { useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/loader/Loader';

export const Login: React.FC = () =>
{
    useEffect(() => {
        axios.post('/api/auth/authenticate')
        .then(response => {
            window.location.href = response.data;
            console.log(response);
        })
        .catch(error => console.log(error));
    }, [])

    return <Loader size='huge' label='Łączenie z systemem USOS...'/>
}

export default Login;
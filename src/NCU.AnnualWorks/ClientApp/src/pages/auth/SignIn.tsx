import React, { useEffect } from 'react';
import axios from 'axios';

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

    return (
        <>

        </>
    );
}

export default Login;
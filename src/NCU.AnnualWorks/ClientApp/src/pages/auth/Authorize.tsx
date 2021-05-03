import React, { useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/loader/Loader';

export const Authorize: React.FC = () =>
{
    useEffect(() => {
        const query = window.location.search.substring(1);
        const params = query.split('&');
        const token = params[0].split('=')[1];
        const verifier = params[1].split('=')[1];
        axios.post('/api/auth/authorize', {
            OAuthToken: token,
            OAuthVerifier: verifier
        })
        .then(response => {
            window.location.search='';
            window.location.pathname='/';
        })
        .catch(error => console.log(error));
    }, [])

    return <Loader size='huge' label='Autoryzacja...'/>
}

export default Authorize;
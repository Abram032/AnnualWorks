import React, { useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/loader/loader';
import { AppSettings } from '../../AppSettings';

export const Authorize: React.FC = () =>
{
    //TODO: Move to api
    useEffect(() => {
        const query = window.location.search.substring(1);
        const params = query.split('&');
        const token = params[0].split('=')[1];
        const verifier = params[1].split('=')[1];
        axios.post(AppSettings.API.Auth.Authorize, {
            OAuthToken: token,
            OAuthVerifier: verifier
        })
        .then(response => {
            window.location.search='';
            window.location.pathname='/';
        })
        .catch(error => console.log(error));
    }, [])

    return <Loader size='medium' label='Autoryzacja...'/>
}

export default Authorize;
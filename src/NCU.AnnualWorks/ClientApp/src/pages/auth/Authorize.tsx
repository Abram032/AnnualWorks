import React, { useEffect } from 'react';
import Loader from '../../components/loader/loader';
import { AppSettings } from '../../AppSettings';
import Api from '../../shared/api/Api';
import { useHistory } from "react-router-dom";

export const Authorize: React.FC = () =>
{
    const history = useHistory();
    //TODO: Move to api
    useEffect(() => {
        const query = window.location.search.substring(1);
        const params = query.split('&');
        const token = params[0].split('=')[1];
        const verifier = params[1].split('=')[1];

        Api.post(AppSettings.API.Auth.Authorize, {
            OAuthToken: token,
            OAuthVerifier: verifier
        }).then(response => {
            history.push('/');
        })
        .catch(error => console.log(error));
    }, [])

    return <Loader size='medium' label='Autoryzacja...'/>
}

export default Authorize;
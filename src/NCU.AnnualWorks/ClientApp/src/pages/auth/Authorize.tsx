import React, { useEffect } from 'react';
import Loader from '../../components/loader/Loader';
import { AppSettings } from '../../AppSettings';
import { useApi } from '../../shared/api/Api';
import { useHistory } from "react-router-dom";
import { RouteNames } from '../../shared/consts/RouteNames';

export const Authorize: React.FC = () =>
{
    const history = useHistory();
    const api = useApi();
    //TODO: Move to api
    useEffect(() => {
        const query = window.location.search.substring(1);
        const params = query.split('&');
        const token = params[0].split('=')[1];
        const verifier = params[1].split('=')[1];

        api.post(AppSettings.API.Auth.Authorize, {
            OAuthToken: token,
            OAuthVerifier: verifier
        }).then(response => {
            history.push(RouteNames.root);
        })
        .catch(error => {
            console.error(error);
            //history.push(RouteNames.error);
        });
    }, [])

    return <Loader size='medium' label='Autoryzacja...'/>
}

export default Authorize;
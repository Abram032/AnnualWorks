import React, { useEffect } from "react";
import axios from "axios";

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
            console.log(response);
        })
        .catch(error => console.log(error));
    }, [])

    return (
        <>

        </>
    );
}

export default Authorize;
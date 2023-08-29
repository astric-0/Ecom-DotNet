import { Navigate } from "react-router-dom";
import TokenHandler from "../../../TokenHandler";
import internalRoutes from "../RoutesMap/InternalRoutes";
import externalRoutes from "../RoutesMap/ExternalRoutes";
import { useState, useEffect } from "react";
import Loading from "../../../Components/Common/Loading";
import { VerifyTokenRequest } from "../../../requests/CommonRequests";

export const ExternalRouteRestriction = ({ children }) => {    
    const { accessToken, accountType } = TokenHandler.getInfo();

    let output = children;
    if (accessToken == null)
        TokenHandler.deleteInfo();
    else
        output = <Navigate to={ internalRoutes[accountType] } />

    return <>{ output }</>;
}

export const InternalRouteRestriction = ({ children, accountType }) => {
    const [ output, setOutPut ] = useState(<Loading message="Checking Authentication" />);

    useEffect(_ => {
        if (TokenHandler.getAccountType() == accountType) {
            VerifyTokenRequest()
            .then(_ => setOutPut(children))
            .catch(error => setOutPut(<Navigate to={ externalRoutes[accountType] } />));
        }
        else
            setOutPut(<Navigate to={ externalRoutes[accountType] } />)
    }, []);

    return <>{ output }</>;
}
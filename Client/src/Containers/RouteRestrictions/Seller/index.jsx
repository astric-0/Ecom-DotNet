import { Navigate } from "react-router-dom";
import TokenHandler from "../../../TokenHandler";
import { internalRoutes } from "../RoutesMap/InternalRoutes";
import { useEffect, useState } from "react";
import Loading from "../../../Components/Loading";
import { VerifyTokenRequest } from "../../../requests/CommonRequests";

export const SellerInternalRouteRestriction = ({ children }) => {
    const [output, setOutPut] = useState(<Loading message="Checking Authentication" />);

    useEffect(_ => {
        if (TokenHandler.getAccountType() == 'seller') {
            VerifyTokenRequest()
            .then(_ => setOutPut(children))
            .catch(error => setOutPut(<Navigate to={'/seller'} />));
        }
        else
            setOutPut(<Navigate to={internalRoutes['seller']} />)
    }, []);

    return (output);
}
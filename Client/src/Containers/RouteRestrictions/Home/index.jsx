import TokenHandler from "../../../TokenHandler";
import internalRoutes from "../RoutesMap/InternalRoutes";
import { Navigate } from "react-router-dom";
import { VerifyTokenRequest } from "../../../requests/CommonRequests";
import { useEffect, useState } from "react";
import { ErrorAlert } from "../../../Components/Common/Alert";

export const HomeRouteRestriction = ({ children }) => {
    const { accessToken, accountType } = TokenHandler.getInfo();
    const [output, setOutput] = useState();

    useEffect(_ => {
        if (accessToken == null)
            return setOutput(children);

        else if (accountType == 'customer' || accountType == 'user') {
            VerifyTokenRequest()
            .then(_ => { setOutput(children) })
            .catch(error => { 
                ErrorAlert(error);
                setOutput(children);
            })
        }

        else {
            let route = internalRoutes[accountType];

            if (!route) {
                TokenHandler.deleteInfo();
                route = '/home';
            }

            setOutput(<Navigate to={ route }/>)
        }
    }, []);

    return output;
}
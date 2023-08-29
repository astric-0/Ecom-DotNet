import { useEffect, useState } from "react";
import Loading from "../../Components/Common/Loading";
import { VerifyTokenRequest } from "../../requests/CommonRequests";

const Init = ({ children }) => {
    const [output, setOutput] = useState(<Loading message={"Checking Access Token"}/>)

    useEffect(_ => {
        VerifyTokenRequest()
        .then(_ => setOutput(children))
        .catch(message => setOutput(children));
    }, []);

    return <>{output}</>;
}

export default Init;
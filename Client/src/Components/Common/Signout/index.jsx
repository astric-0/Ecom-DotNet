import { Navigate } from "react-router-dom";
import TokenHandler from "../../../TokenHandler";

const Signout = _ => {
    TokenHandler.deleteInfo();
    return <> <Navigate to={'/home'} /> </>
}

export default Signout;
import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FormGroup, Button, Input, Label, Container } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import { UserSigninRequest } from "../../../requests/UserRequests";
import { ErrorAlert, SuccessAlert } from "../../Common/Alert";
import internalRoutes from "../../../Containers/RouteRestrictions/RoutesMap/InternalRoutes";
import UserGoogleSignin from "../UserGoogleSignin";

const UserSigninForm = _ => {
    const initUserSigninData = { username: '', password: '' };
    const [userSigninData, setUserSigninData] = useState(initUserSigninData);
    const [passwordInputType, setPasswordInputType] = useState('password');
    const navigate = useNavigate();

    const togglePasswordInputType = _ => setPasswordInputType(passwordInputType == 'password' ? 'text' : 'password');

    const handleUsername = event => setUserSigninData({ ...userSigninData, 'username': event.target.value.trim() });
    const handlePassword = event => setUserSigninData({ ...userSigninData, 'password': event.target.value });

    const handleSignin = _ => {
        UserSigninRequest(userSigninData)
        .then(_ => { navigate(internalRoutes['user']); })
        .catch(error => { ErrorAlert(error) });
    }

    const { username, password } = userSigninData;
    return (
        <Container className="bg-light m-0 p-4 border rounded">
            
            <div className="d-flex">
                <h2 className="mx-auto text-primary">
                    <FontAwesomeIcon icon={faSignIn} className="mx-1" />{' '}<b>Sign in</b>
                </h2>
            </div>

            <FormGroup>
                <Label>Username*</Label>
                <Input value={username} onChange={handleUsername} placeholder="type the unique name key here" autoFocus/>
            </FormGroup>

            <FormGroup className="mt-4">
                <Label>Password*</Label>
                <Input type={passwordInputType} autoComplete="off" value={password} onChange={handlePassword} placeholder="type your password here" />
            </FormGroup>

            <FormGroup switch>                                            
                <Input type='switch' onChange={togglePasswordInputType} checked={passwordInputType == 'text'} />
                <small className='mx-2'>See Password</small>                
            </FormGroup>

            <Button color="primary" className="mt-4 w-100" onClick={handleSignin} outline>Sign in</Button>
            <UserGoogleSignin />
        </Container>
    )
}

export default UserSigninForm;
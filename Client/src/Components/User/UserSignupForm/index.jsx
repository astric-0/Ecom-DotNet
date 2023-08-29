import { Button, Label, Input, FormGroup, Container, ButtonGroup } from "reactstrap";
import FormMessage from "../../Common/FormMessage";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import { UserSignupRequest } from "../../../requests/UserRequests";
import { ErrorAlert, SuccessAlert } from "../../Common/Alert";
import { useNavigate } from "react-router-dom";

const UserSignupForm = _ => {

    const initUserSignupData = { username: '', gender: '', doB: '', email: '', password: '' };
    const [userSignupData, setUserSignupDate] = useState(initUserSignupData);
    const [passwordInputType, setPasswordInputType] = useState('password');
    const navigate = useNavigate();

    const togglePasswordInputType = _ => setPasswordInputType(passwordInputType == 'password' ? 'text' : 'password');
    
    const handleInputTrim = key => event => setUserSignupDate({ ...userSignupData, [key]: event.target.value.trim() });
    const handleInput = key => event => setUserSignupDate({ ...userSignupData, [key]: event.target.value });
    const handleInputGender = value => _ => setUserSignupDate({ ...userSignupData, 'gender': value });    
    const handleInputDate = event => setUserSignupDate({ ...userSignupData, 'doB': new Date(event.target.value) });

    const handleSignup = _ => {
        UserSignupRequest(userSignupData)
        .then(_ => {
            SuccessAlert('Your account has been created... Please Signin ... Redirecting');
            setTimeout(_ => navigate('/user/signin'));
        })
        .catch(error => ErrorAlert(error));
    }

    const { username, gender, email, password } = userSignupData;
    return (
        <Container className="bg-light p-3 rounded">
            <div className="d-flex">
                <h2 className="mx-auto text-primary">
                    <FontAwesomeIcon icon={faPen} className="mx-1" />{' '}<b>Sign up</b>
                </h2>
            </div>
        
            <FormGroup>
                <Label>Username*</Label>
                <Input value={username} onChange={handleInputTrim('username')} placeholder="Go Creative" autoFocus />
            </FormGroup>

            <FormGroup>
                <Label>Gender</Label>
                <div className="d-flex">
                    <ButtonGroup className="mx-auto">                        
                        <Button color="primary" onClick={handleInputGender('female')} active={(gender=='female')} outline>Female</Button>
                        <Button color="primary" onClick={handleInputGender('male')} active={(gender=='male')} outline>Male</Button>
                        <Button color="primary" onClick={handleInputGender('others')} active={(gender=='others')} outline>Others</Button>
                        <Button color="primary" onClick={handleInputGender('')} active={(gender=='')} outline>Mention not</Button>                        
                    </ButtonGroup>
                </div>
            </FormGroup>

            <FormGroup>
                <Label>Date of Birth</Label>
                <Input type="date" onChange={handleInputDate} />
            </FormGroup>

            <FormGroup>
                <Label>Email*</Label>
                <Input value={email} onChange={handleInputTrim('email')} placeholder="Is Joe Bidden that old?" />
            </FormGroup>

            <FormGroup>
                <Label>Password*</Label>
                <Input type={passwordInputType} value={password} onChange={handleInput('password')} autoComplete="off" placeholder="8 letters minimum" />
            </FormGroup>

            <FormGroup switch>
                <Input type="switch" active={ (passwordInputType == 'text') } onClick={togglePasswordInputType} />
                <small>See Password</small>
            </FormGroup>

            <Button color="primary" className="w-100 mt-4" onClick={handleSignup} outline>Sign up</Button>

            <FormMessage />
        
        </Container>
    )
}

export default UserSignupForm;
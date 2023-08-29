import { Button, Label, Input, Form, FormGroup } from "reactstrap";
import FormMessage from "../../Common/FormMessage";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import { SellerSigninRequest } from "../../../requests/SellerRequests";
import { useNavigate } from "react-router-dom";

const SellerSignin = _ => {
    const initSigninData = { 'Sellername': '', 'Password': '' };
    const [signinData, setSigninData] = useState(initSigninData);
    const [passwordFieldType, setPasswordFieldType] = useState('password');
    const initFormFeedBack = { errorFlag: false, message: '' };
    const [formFeedBack, setFormFeedBack] = useState(initFormFeedBack);
    const navigate = useNavigate();

    const togglePasswordFieldType = _ => setPasswordFieldType(passwordFieldType == 'password' ? 'text' : 'password');
    const handleInputTrim = key => event => setSigninData({ ...signinData, [key]: event.target.value.trim() });
    const handleInput = key => event => setSigninData({ ...signinData, [key]: event.target.value });    

    const handleSignin = event => {
        event.preventDefault();
        SellerSigninRequest(signinData)
        .then(_ => { 
            setFormFeedBack({ errorFlag: false, message: "signed in" });
            setTimeout(_ => navigate('/seller/products'), 2000);
        })
        .catch(error => setFormFeedBack({ errorFlag: true, message: error }));
    }

    const cleanFormFeedBack = _ => formFeedBack.message.length > 0 && setFormFeedBack(initFormFeedBack);

    const { Sellername, Password } = signinData;
    const { errorFlag, message } = formFeedBack;
    return (
        <>
            <div className="d-flex">
                <h2 className="mx-auto text-primary">
                    <FontAwesomeIcon icon={faSignIn} className="mx-1" />{' '}<b>Sign in</b>
                </h2>
            </div>

            <Form>
                <FormGroup>
                    <Label>Seller Name*</Label>
                    <Input value={Sellername} onChange={handleInputTrim('Sellername')} onClick={cleanFormFeedBack} autoFocus/>
                </FormGroup>

                <FormGroup>
                    <Label>Seller Password*</Label>
                    <Input type={passwordFieldType} autoComplete="off" value={Password} onChange={handleInput('Password')} onClick={cleanFormFeedBack} />
                </FormGroup>

                <FormGroup switch>
                    <Input type='switch' onClick={togglePasswordFieldType} onChange={_ => {}} checked={(passwordFieldType == 'text')} />
                    <small className='mx-2'>See Password</small>
                </FormGroup>

                <Button color="primary" className="w-100 mt-4" onClick={handleSignin} outline>Sign in</Button>
                <FormMessage errorFlag={errorFlag} message={message}/>
            </Form>
        </>
    )
}

export default SellerSignin;
import { Button, Label, Input, Form, FormGroup } from "reactstrap";
import FormMessage from "../../Common/FormMessage";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSign } from "@fortawesome/free-solid-svg-icons";
import { SellerSignupRequest } from "../../../requests/SellerRequests";

const SellerSignup = _ => {
    const initsingupData = { 'Sellername': '', 'Password': '', 'About': '', 'Address': '', 'Email': '' };
    const [signupData, setSignupData] = useState(initsingupData);
    const initFormFeedBack = { errorFlag: false, message: '' };
    const [formFeedBack, setFormFeedBack] = useState(initFormFeedBack);

    const handleInputTrim = key => event => setSignupData({ ...signupData, [key]: event.target.value.trim() });
    const handleInput = key => event => setSignupData({ ...signupData, [key]: event.target.value });

    const cleanFormFeedBack = _ => formFeedBack.message.length > 0 && setFormFeedBack(initFormFeedBack);

    const handleSignup = _ => { 
        SellerSignupRequest(signupData)
        .then(_ => setFormFeedBack({ errorFlag: false, message: 'Account Created'}))
        .catch(error => setFormFeedBack({ errorFlag: true, message: error }) );
    }

    const { Sellername, Password, About, Address, Email } = signupData;
    const { errorFlag, message } = formFeedBack;

    return (
        <>
            <div className="d-flex">
                <h2 className="mx-auto text-primary">
                    <FontAwesomeIcon icon={faSign} className="mx-1" />{' '}<b>Sign up</b>
                </h2>
            </div>
            <Form>
                <FormGroup>
                    <Label>Seller name*</Label>
                    <Input value={Sellername} onChange={handleInputTrim('Sellername')} onClick={cleanFormFeedBack} autoFocus />
                </FormGroup>

                <FormGroup>
                    <Label>About*</Label>
                    <Input type='textarea' value={About} onChange={handleInput('About')} onClick={cleanFormFeedBack} />
                </FormGroup>

                <FormGroup>
                    <Label>Address*</Label>
                    <Input type='textarea' value={Address} onChange={handleInput('Address')} onClick={cleanFormFeedBack} />
                </FormGroup>

                <FormGroup>
                    <Label>Email*</Label>
                    <Input value={Email} onChange={handleInputTrim('Email')} onClick={cleanFormFeedBack} />
                </FormGroup>

                <FormGroup>
                    <Label>Password*</Label>
                    <Input type='password' value={Password} onChange={handleInput('Password')} onClick={cleanFormFeedBack}  />
                </FormGroup>

                <Button color="primary" className="w-100 mt-4" onClick={handleSignup} outline>Sign up</Button>

                <FormMessage errorFlag={errorFlag} message={message}/>
            </Form>
        </>
    )
}

export default SellerSignup;
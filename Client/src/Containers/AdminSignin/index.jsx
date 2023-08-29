import { Container, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";

import Calender from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { faUserNinja } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Center from "../../Components/Common/Center";
import style from './style.module.css';
import { useState } from "react";

const AdminSignin = _ => {

    const [ adminSigninInfo, setAdminSigninInfo ] = useState({ adminName: "", password: "" });

    const handleAdminName = event => setAdminSigninInfo({ ...adminSigninInfo, "adminName": event.target.value.trim() });
    const handleAdminPassword = event => setAdminSigninInfo({ ...adminSigninInfo, "password": event.target.value });

    const { adminName, password } = adminSigninInfo;
    return (
        <div className={ style.container }>
            <Center>
                <Row>
                    <Col xs={6}>
                        <Calender className="w-100 border-0 rounded" tileClassName='py-4' onClickDay={_ => ''} view="month" showNavigation={false} />
                    </Col>
                    <Col>
                        <Container className="bg-light rounded p-3">
                            <div className="d-flex">
                                <h1 className="mx-auto"><FontAwesomeIcon className="mx-2" icon={faUserNinja}/>Sign in</h1>
                            </div>

                            <FormGroup className="mt-2">
                                <Label><b>Super Username*</b></Label>
                                <Input size="lg" onChange={handleAdminName} value={adminName} placeholder="type the super username here" autoFocus />
                            </FormGroup>

                            <FormGroup className="mt-2">
                                <Label><b>Password*</b></Label>
                                <Input type="password" size="lg" autoComplete="off" onChange={handleAdminPassword} value={password} placeholder="type the password here" />
                            </FormGroup>

                            <FormGroup switch>
                                <Input type="switch" />
                                <small>See Password</small>
                            </FormGroup>

                            <Button color="dark" size="lg" className="w-100 mt-3" outline>Sign in</Button>
                        </Container>
                    </Col>
                </Row>
            </Center>
        </div>
    );
}

export default AdminSignin;
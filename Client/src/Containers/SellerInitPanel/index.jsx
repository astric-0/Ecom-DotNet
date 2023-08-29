import Center from "../../Components/Common/Center";
import { Row, Col, Card, CardBody, Container, Button, ButtonGroup } from "reactstrap";
import style from  './style.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import SellerSignin from "../../Components/Seller/SellerSignin";
import SellerSignup from "../../Components/Seller/SellerSignup";

const SellerInitPanel = _ => {

    const [ panel, setPanel ] = useState('signin');
    const changePanel = key => _ => setPanel(key);    

    return (
        <div className={style.container}>
            <Center>
                <Row className="w-75">
                    <Col md={5} className="my-2 p-0 h-100">
                        <Card>
                            <CardBody className="rounded text-light bg-primary">
                                <h2 className="text-center">                                    
                                    <FontAwesomeIcon icon={faShop} className="mx-1" /><b>Sellers Panel</b>
                                </h2>
                                <p className="mt-3">Please follow the guidelines</p>
                                <div className="d-flex mt-4">
                                    <ButtonGroup className="mx-auto">
                                        <Button color="light" active={panel == 'signin'} onClick={changePanel('signin')} outline>Signin</Button>
                                        <Button color="light" active={panel == 'signup'} onClick={changePanel('signup')} outline>Signup</Button>
                                    </ButtonGroup>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col>
                        <Container className="my-2 bg-light rounded p-4">
                            { panel == 'signin' ? <SellerSignin /> : <SellerSignup  /> }
                        </Container>
                    </Col>
                </Row>
            </Center>
        </div>
    );
}

export default SellerInitPanel;
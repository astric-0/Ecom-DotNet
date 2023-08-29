import { Button, Row, Col, Card, CardBody, CardFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import Center from "../../Components/Common/Center";
import style from './style.module.css';
import UserSigninForm from "../../Components/User/UserSigninForm";
import { useNavigate } from "react-router-dom";

const UserSignin = _ => {

    const navigate = useNavigate();

    const handlePageJump = _ => navigate('/user/signup');

    return (
        <div className={style.container}>
            <Center>
                <Row className="w-75">
                    <Col md={5} className="m-0">
                        <Card className="bg-primary" outline>
                            <CardBody className="rounded text-light" >
                                <h2 className="text-center">                                    
                                    <FontAwesomeIcon icon={faUserAstronaut} className="mx-1" /><b>Welcome bud</b>
                                </h2>

                                <p className="my-3">Alot is waiting for today!</p>                                                               
                            </CardBody>
                            <CardFooter className="border-0">                                   
                                <Button color="light" className="w-100" outline onClick={handlePageJump}>
                                    <FontAwesomeIcon icon={faPen} className="mx-2" />
                                    Sign up ?
                                </Button>           
                            </CardFooter>
                        </Card>
                    </Col>

                    <Col md={7} className="m-0">
                        <UserSigninForm />
                    </Col>
                </Row>
            </Center>

        </div>
    );
}

export default UserSignin;
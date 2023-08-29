import { Button, Row, Col, Card, CardBody, CardFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeace, faSignIn } from "@fortawesome/free-solid-svg-icons";
import Center from "../../Components/Common/Center";
import style from './style.module.css';
import { useNavigate } from "react-router-dom";
import UserSignupForm from "../../Components/User/UserSignupForm";

const UserSignup = _ => {
    const navigate = useNavigate();
    
    const handlePageJump = _ => navigate('/user/signin');
    return (
        <div className={style.container}>
            <Center>
                <Row className="w-75">
                    <Col md={7}>    
                        <UserSignupForm />                    
                    </Col>
                    <Col md={5}>
                        <Card className="bg-primary" outline>
                            <CardBody className="rounded text-light" >
                                <h2 className="text-center">                                    
                                    <FontAwesomeIcon icon={faPeace} className="mx-1" /><b>New here bud?</b>
                                </h2>

                                <p className="my-3">Let's set you up!</p>                                                               
                            </CardBody>
                            <CardFooter className="border-0">
                                <Button color="light" className="w-100" outline onClick={handlePageJump}>
                                    <FontAwesomeIcon icon={faSignIn} className="mx-2" />
                                    Sign in ?
                                </Button>                                
                            </CardFooter>
                        </Card>
                    </Col>                    
                </Row>
            </Center>

        </div>
    );
}

export default UserSignup;
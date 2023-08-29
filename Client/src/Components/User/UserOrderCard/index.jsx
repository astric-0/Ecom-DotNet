import { Container, Card, CardHeader, CardBody, CardFooter, Row, Col, Button, ButtonGroup, CardImg } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faCancel, faCheck, faTrash, faInfo, faShop, faLocationPin } from "@fortawesome/free-solid-svg-icons";

import config from "../../../Config";
import style from "./style.module.css";
import { ShowProductInfoCaps, ShowSellerData, ErrorAlert } from "../../Common/Alert";
import { HomeGetSellerDataBySellerId } from "../../../requests/HomeRequests";

const UserOrderCard = ({ orderInfo }) => {
    
    const { order, orderedProducts } = orderInfo;
    const { orderId, userId, amount, userAddress, orderDate, isCancelled, paymentMethod, completedOn } = order;    

    const orderProductList = orderedProducts?.map((orderedProduct, index) => {
        const product = JSON.parse(orderedProduct?.productData);
        
        const { ProductName, Filename, Price } = product
        const { quantity } = orderedProduct;

        const handleInfo = _ => ShowProductInfoCaps(product);

        const handleSellerData = _ => {
            HomeGetSellerDataBySellerId(product.SellerId)
            .then(sellerData => ShowSellerData(sellerData))
            .catch(error => ErrorAlert(error));
        }

        return (
            <Container key={ index } className="col-md-5">
                <div className="d-flex">
                    <CardImg className={ style.image } src={ config.path("/images/" + Filename) } />
                    <h4>{ ProductName }</h4>
                </div>
                <ButtonGroup className="w-100 mt-4">
                    <Button color="primary" outline>
                        { 'Price: ' + (Price * quantity) + ' Quantity: ' + quantity }
                    </Button>
                    <Button color='primary' onClick={ handleInfo } title='Show more info'>
                        <FontAwesomeIcon icon={ faInfo }/>
                    </Button>
                    <Button color='primary' onClick={ handleSellerData } title='Show seller info'>
                        <FontAwesomeIcon icon={ faShop }/>
                    </Button>
                </ButtonGroup>
            </Container>
        );
    });    

    const { HouseNumber, Area, State } = JSON.parse(userAddress);

    return (
        <Container className="my-2">
            <Card className="bg-white shadow">
                <CardHeader className="border-0 bg-white">
                    <Row className="justify-content-between">                        
                        <Col md={7}>
                            <div className="text-primary fw-bold">
                                <FontAwesomeIcon icon={ faBoxOpen } />
                                <small>{ ' Order ID: ' + orderId }</small>
                            </div>
                            <h5 className="fw-bold">
                                <FontAwesomeIcon icon={ faLocationPin } />
                                { ` ${ HouseNumber }, ${ Area }, ${ State }` }
                            </h5>
                        </Col>    
                        <Col md={3}>
                            {
                                completedOn != null
                                ?   
                                    <ButtonGroup>
                                        <Button color="success"><FontAwesomeIcon icon={ faCheck } /></Button>
                                        <Button color="danger"><FontAwesomeIcon icon={ faTrash } /></Button>
                                    </ButtonGroup>
                                :
                                !isCancelled
                                ?
                                    <ButtonGroup className="w-100">                                        
                                        <Button color="dark" title="Ordered On" outline>{ new Date(orderDate).toDateString() }</Button>
                                        {/* <Button color="dark">{ amount }</Button> */}
                                        <Button color="danger" title="Cancel Order"><FontAwesomeIcon icon={ faCancel } /></Button>
                                    </ButtonGroup>
                                :
                                ''
                            }
                        </Col>
                    </Row>
                </CardHeader>
                
                <CardBody>
                    <Row>
                        { orderProductList }
                    </Row>
                </CardBody>

                <CardFooter className="border-0 bg-transparent text-center">
                    <Button size="lg" color="dark">&#8377; { amount }</Button>
                </CardFooter>
            </Card>
        </Container>
    );
}

export default UserOrderCard;
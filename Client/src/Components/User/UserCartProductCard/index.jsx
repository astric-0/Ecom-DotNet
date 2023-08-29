import { 
    Col, Row, Card, CardTitle, CardBody, CardText, CardHeader, CardImg, 
    ButtonGroup, Button, CardFooter
} from 'reactstrap';
import config from '../../../Config';
import style from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faMinus, faShop, faTrashCan, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';

import { 
    UserIncreaseCartProductQuantity, UserDecreaseCartProductQuantity, UserDeleteCartProduct,    
} from '../../../requests/UserRequests';
import { HomeGetSellerDataBySellerId } from '../../../requests/HomeRequests';
import { ErrorAlert, SuccessAlert, ShowSellerData } from '../../Common/Alert';
import UserContext from '../../../Context/User/Context';

const UserCartProductCard = ({ product, index, buyProductClick }) => {

    const { cartId, productId, sellerId, productName, details, filename, price, stock, quantity } = product;
    const { updateCartProductQuantityByIndex, deleteCartProductByIndex } = useContext(UserContext);    

    const handleChangeQuantity = operation => {
        const operatorFunction = operation == 'increase' 
            ? UserIncreaseCartProductQuantity 
            : UserDecreaseCartProductQuantity;

        return _ => operatorFunction(cartId, quantity)
            .then(newQuantity => { updateCartProductQuantityByIndex(index, newQuantity); })
            .catch(error => ErrorAlert(error));
    }

    const handleDeleteCartProduct = _ => {
        UserDeleteCartProduct(cartId)
        .then(_ => { 
            SuccessAlert(`Product ${productName} Deleted`);
            deleteCartProductByIndex(index);
        })
        .catch(error => ErrorAlert(error));
    }

    const handleSellerData = _ => {
        HomeGetSellerDataBySellerId(sellerId)
        .then(sellerData => ShowSellerData(sellerData))
        .catch(error => ErrorAlert(error));
    }

    return (
        <Card className={'w-75 my-3 mx-auto px-2 ' + style.card} >

            <CardHeader className='border-0'>
                <CardTitle tag="h3" className='text-dark text-center'>{ productName }</CardTitle>
            </CardHeader>

            <Row>
                <Col xs={4}>
                    <CardImg src={config.path('/images/' + filename)} className={style.cardImg} />                                                            
                </Col>
                <Col>
                    <CardBody>
                        <CardText className='h5 bg-light rounded p-2'>{ details }</CardText>

                        <div className='mt-3'>
                            <CardText className='h4 bg-light rounded p-2 d-inline'>Stock: {stock}</CardText>
                        </div>

                        <div className='mt-4'>
                            <h2 className='text-light d-inline rounded bg-primary p-2'>
                                <b><sup>&#8377;</sup>{ ' ' + price }</b>
                            </h2>
                        </div>
                    </CardBody>
                </Col>
            </Row>

            <CardFooter className='border-0'>
                <Row className='justify-content-center'>
                    <Col xs={1}>
                        <ButtonGroup className='w-100'>
                            <Button color='danger' onClick={ handleDeleteCartProduct } title='Remove from cart'><FontAwesomeIcon icon={faTrashCan}/></Button>
                        </ButtonGroup>
                    </Col>
                    <Col xs={3}>
                        <ButtonGroup className='w-100'>
                            <Button color='dark'title='Increase quantity' onClick={handleChangeQuantity('increase')} outline>
                                <FontAwesomeIcon icon={faAdd} />
                            </Button>
                            <Button color='dark'>{ quantity }</Button>
                            <Button color='dark' title='Decrease quantity' onClick={handleChangeQuantity('decrease')} outline>
                                <FontAwesomeIcon icon={faMinus} />
                            </Button>
                        </ButtonGroup>
                    </Col>
                    <Col xs={3}>
                        <ButtonGroup className='w-100'>
                            <Button color='primary' onClick={handleSellerData} title='Show seller info'><FontAwesomeIcon icon={faShop}/></Button>
                            <Button color='light' title='To Pay'>
                                <b> &#8377;{' ' + (price * quantity) } </b>
                            </Button>
                            <Button color='success' title='Buy the product' onClick={ buyProductClick(product, index) }><FontAwesomeIcon icon={ faCheck }/></Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </CardFooter>
        </Card>
    );
}

export default UserCartProductCard;
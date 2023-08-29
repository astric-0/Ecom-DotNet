import { Card, CardBody, CardImg, CardText, CardFooter, Button, ButtonGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faShop, faInfo } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import config from '../../../Config';
import style from './style.module.css';
import { ErrorAlert, ShowProductInfo, ShowSellerData, SuccessAlert } from '../../Common/Alert';
import { UserAddToCartRequest } from '../../../requests/UserRequests';
import { HomeGetSellerDataBySellerId } from '../../../requests/HomeRequests';
import TokenHandler from '../../../TokenHandler';

const HomeMultiCarouselSlide = ({ product }) => {    

    const { productId, filename, productName, price, sellerId } = product;
    const navigate = useNavigate();

    const handleInfo = _ => ShowProductInfo(product);

    const handleAddToCart = _ => {
        if (!TokenHandler.getAccessToken()) 
            return navigate('/user/signin');

        UserAddToCartRequest(productId)
        .then(_ => { SuccessAlert('Product Added to cart'); })
        .catch(error => { ErrorAlert(error); });
    }

    const handleSellerData = _ => {
        HomeGetSellerDataBySellerId(sellerId)
        .then(sellerData => ShowSellerData(sellerData))
        .catch(error => ErrorAlert(error));
    }

    return (
        <Card className={'mx-2 my-2 h-100 border-0 py-2 rounded bg-transparent '}>
            <CardImg src={config.path('/images/' + filename)} className={style.cardImgTop + ' rounded' } top />
            <CardBody className='bg-white my-1 rounded'>
                <CardText><b>{ productName }</b></CardText>
                <h3><CardText className='fw-bold'><sup>&#8377;</sup> { ' ' + price }</CardText></h3>
            </CardBody>
            <CardFooter className='border-0'>
                <ButtonGroup className='w-100'>
                    <Button color='primary' onClick={handleAddToCart} title='Add to your cart'><FontAwesomeIcon icon={faCartPlus}/></Button>
                    <Button color='primary' onClick={handleInfo} title='Show more info'><FontAwesomeIcon icon={faInfo}/></Button>
                    <Button color='primary' onClick={handleSellerData} title='Show seller info'><FontAwesomeIcon icon={faShop}/></Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    )
}

export default HomeMultiCarouselSlide;
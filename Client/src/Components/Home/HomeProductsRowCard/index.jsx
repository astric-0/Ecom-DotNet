import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText } from 'reactstrap';
import config from '../../../Config';
import style from './style.module.css';

const HomeProductsRowCard = ({ product }) => {
    const { productName, productId, filename, details, stock, price } = product;

    return (
        <Card className='mx-1 w-75'>
            <Row>
                <Col>
                    <CardImg src={config.path('/images/' + filename)} className={style.cardImg} />
                </Col>
                <Col>
                    <CardBody>
                        <CardTitle><b>{productName}</b></CardTitle>                        
                        <CardText>{ details }</CardText>
                    </CardBody>
                </Col>
            </Row>
        </Card>
    );
}

export default HomeProductsRowCard;
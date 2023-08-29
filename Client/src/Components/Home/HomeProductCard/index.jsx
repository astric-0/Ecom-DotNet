import { Card, CardHeader, CardImg, Container } from "reactstrap";
import config from "../../../Config";
import style from './style.module.css';

const HomeProductCard = ({ product }) => {

    const { productId, productName, sellerId, filename, category, details, price, stock } = product;
    return (        
        <Card className="col" outline>
            <CardImg src={config.path('/images/' + filename)} className={style.cardImgTop} top/>
            <CardHeader>{ productName }</CardHeader>
        </Card>        
    );
}

export default HomeProductCard;
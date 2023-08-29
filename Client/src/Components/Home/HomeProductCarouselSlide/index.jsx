import { CarouselCaption, CarouselItem } from "reactstrap";
import config from "../../../Config";

const HomeProductCarouselSlide = ({ product }) => {
    const { filename, productName } = product;
    return (
        <CarouselItem>
            <img src={config.path('/images/' + filename)}/>
            <CarouselCaption captionText={productName} />
        </CarouselItem>
    );
}

export default HomeProductCarouselSlide;
import { Carousel, CarouselControl, CarouselIndicators } from "reactstrap";
import HomeProductCarouselSlide from "../HomeProductCarouselSlide";
import { useState, useContext } from "react";
import HomeContext from "../../../Context/Home/Context";

const HomeProductsCarousel = _ => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const { getProducts } = useContext(HomeContext);
    const products = getProducts();

    const next = _ => (!animating) && setActiveIndex(products.length == activeIndex ? 0 : activeIndex+1);    
    
    const previous = _ => (!animating) && setActiveIndex(activeIndex == -1 ? products.length-1 : activeIndex-1);    

    const jumpIndex = index => !animating && setActiveIndex(index);

    const slides = products.map(product => <HomeProductCarouselSlide key={product.productId} product={product}/>);

    return (
        <Carousel activeIndex={activeIndex} next={next} previous={previous}>
            <CarouselIndicators items={products} activeIndex={activeIndex} onClickHandler={jumpIndex} />            
            {slides}
            <CarouselControl direction="prev" directionText="<" onClickHandler={previous} />
            <CarouselControl direction="next" directionText=">" onClickHandler={next} />
        </Carousel>
    );
}

export default HomeProductsCarousel;
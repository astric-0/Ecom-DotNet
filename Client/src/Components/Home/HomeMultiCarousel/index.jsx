import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import { useContext } from 'react';
import { Container } from 'reactstrap';

import HomeContext from '../../../Context/Home/Context';
import HomeMultiCarouselSlide from '../HomeMultiCarouselSlide';

const responsive = {
    superLargeDesktop: {      
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 1500, min: 1024 },
        items: 4
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const HomeMultiCarousel = ({ range }) => {
    const { getProducts } = useContext(HomeContext);
    const products = getProducts();
         
    const productCards = [], { start, end } = range;;
    for (let i = start; i <= end && i < products.length; i++)
        productCards.push(<HomeMultiCarouselSlide key={i} product={products[i]}/>);    

    return (
        <Container className='p-2' >
            <Carousel 
                swipeable={false} 
                draggable={false} 
                stopOnHover={true} 
                focusOnSelect={false} 
                autoPlay={true}                
                infinite={true}                                
                responsive={responsive}
                slidesToSlide={0}                                
            >
                { productCards }
            </Carousel>
        </Container>
    )
}

HomeMultiCarousel.defaultProps = {
    range : {
        start: 0,
        end: 20
    }
}

export default HomeMultiCarousel;   
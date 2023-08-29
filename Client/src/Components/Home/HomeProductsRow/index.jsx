import { Row } from "reactstrap";
import HomeContext from "../../../Context/Home/Context";
import { useContext } from "react";
//import HomeMultiCarouselSlide from "../HomeMultiCarouselSlide";
import HomeProductsRowCard from "../HomeProductsRowCard";

const HomeProductsRow = ({ range }) => {
    const { getProducts } = useContext(HomeContext);
    
    const productCards = [], { start, end } = range, products = getProducts();     
    for (let i = start; i <= end && i < products.length; i++)
        productCards.push(<HomeProductsRowCard key={i} product={products[i]} />);

    return (
        <section className="w-100">
            <Row className="justify-content-around row-cols-1 row-cols-lg-3 mt-3 g-3">
                {productCards}
            </Row>
        </section>
    );
}

HomeProductsRow.defaultProps = {
    range: {
        start: 0,
        end: 20
    }
}

export default HomeProductsRow;
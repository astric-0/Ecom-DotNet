//import HomeProductCard from "../../Components/Home/HomeProductCard";
//import { Container, Row } from "reactstrap";
//import HomeProductsCarousel from "../../Components/Home/HomeProductsCarousel";
//import { Container } from "reactstrap";
import HomeProductsRow from "../../Components/Home/HomeProductsRow";
import HomeMultiCarousel from "../../Components/Home/HomeMultiCarousel";
import style from './style.module.css';

const Home = _ => {        

    return (
        <div className={style.container}>            
            <HomeMultiCarousel />
            <HomeProductsRow />            
        </div>
    );
}

export default Home;
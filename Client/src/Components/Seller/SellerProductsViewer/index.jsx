import { useContext, useEffect, useState } from "react";
import SellerContext from "../../../Context/Seller/Context";
import Loading from "../../Common/Loading";
import SellerProductCard from "../SellerProductCard";
import { CardGroup } from "reactstrap";

const SellerProductsViewer = _ => {
    const { getProducts } = useContext(SellerContext);
    const [output, setOutput] = useState(<Loading />)
    
    useEffect(_ => {        
        const products = getProducts();        
        let count = 0, keyCount = 0, max = 3;
        let cardGroups = [], cardGroup = [];

        for (let i = 0; i < products.length; i++) {
            cardGroup.push(<SellerProductCard key={i} index={i} />)
            count++;
            if (count == max) {
                cardGroups.push(<CardGroup key={keyCount++}>{ cardGroup }</CardGroup>);
                cardGroup = [];
                count = 0;
            }
        }

        (count < max) && cardGroups.push(<CardGroup key={keyCount++}>{ cardGroup }</CardGroup>);    
        setOutput(cardGroups);

    }, [getProducts()]);

    return (
        <>{output}</>
    )
}

export default SellerProductsViewer;
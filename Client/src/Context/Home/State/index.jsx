import HomeContext from "../Context";
import { useState, useEffect } from "react";
import { HomeGetAllProductsRequest } from "../../../requests/HomeRequests";
import { ErrorAlert } from "../../../Components/Common/Alert";

const HomeState = ({ children }) => {

    const [products, setProducts] = useState([]);

    useEffect(_ => {
        HomeGetAllProductsRequest()
        .then(loadedProducts => {            
            setProducts(loadedProducts);
        })
        .catch(error => ErrorAlert(error));
    }, []);

    const getProducts = _ => products;

    const values = { getProducts };
    return (
        <HomeContext.Provider value={values}>
            {children}
        </HomeContext.Provider>
    )
}

export default HomeState;
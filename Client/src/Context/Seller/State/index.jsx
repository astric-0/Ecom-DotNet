import SellerContext from '../Context';
import { useEffect, useState } from 'react';
import { SellerGetAllProductsRequest } from '../../../requests/SellerRequests';

const SellerState = ({ children }) => {

    const [products, setProducts] = useState([]);

    useEffect(_ => {
        SellerGetAllProductsRequest()
        .then(productsData => setProducts(productsData))
        .catch(error => console.log(error));
    }, []);

    const getProducts = _ => products;

    const getProductByIndex = index => products[index];

    const removeProductByIndex = index => {
        products.splice(index, 1);
        setProducts([...products]);
    }

    const updateProductByIndex = (index, product) => {
        products[index] = product;
        setProducts([...products])
    }

    const addNewProduct = product => {
        //products.unshift(product);
        products.push(product);
        setProducts([...products]);
    }

    const values = { getProducts, getProductByIndex, removeProductByIndex, addNewProduct, updateProductByIndex };
    return (
        <SellerContext.Provider value={values}>
            { children }
        </SellerContext.Provider>
    );
}

export default SellerState;
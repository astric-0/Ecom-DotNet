import { useState, useEffect, useContext } from "react";
import style from './style.module.css';

import UserAddressesModal from "../../Components/User/UserAddressesModal";
import UserOrderModal from "../../Components/User/UserOrderModal";
import UserCartProductCard from "../../Components/User/UserCartProductCard";
import UserContext from "../../Context/User/Context";

const UserCart = _ => {
    const { getCart } = useContext(UserContext);
    const [ cartProductCards, setCartProductCards ] = useState([]);

    const [ isOpen, setIsOpen ] = useState();
    const [ selectedProduct, setSelectedProduct ] = useState(false);
    const toggle = _ => setIsOpen(!isOpen);

    const handleBuyProductClick = (product, index) => _ => {
        setSelectedProduct({ index, ...product });
        toggle();
    }

    useEffect(_ => {
        const cart = getCart();
        if (cart.length > 0)
            setCartProductCards(
                cart.map((cartProduct, index) => 
                    <UserCartProductCard 
                        key = { index } 
                        index = { index } 
                        product = { cartProduct } 
                        buyProductClick = { handleBuyProductClick }  
                    />)
            );
        else
            setCartProductCards(Array([]));
    }, [ getCart() ]);    

    return (    
        <div className={style.container}>
            <UserAddressesModal
                toggle={ toggle } 
                isOpen={ isOpen } 
                selectedProduct = { selectedProduct } 
            />

            <UserOrderModal />            
            { cartProductCards }
        </div>        
    );
}

export default UserCart;
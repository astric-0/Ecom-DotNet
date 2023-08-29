import { useState, useEffect } from "react";
import UserContext from "../Context";
import { UserGetCartRequest } from "../../../requests/UserRequests";
import { ErrorAlert } from "../../../Components/Common/Alert";

const UserState = ({ children }) => {

    const [ cart, setCart ] = useState([]);
    const [ addresses, setAddressess ] = useState([]);
    const [ userOrders, setUserOrders ] = useState([]);

    useEffect(_ => {
        UserGetCartRequest()
        .then(responseData => {            
            setCart([...responseData.cartData]);
            setAddressess([...responseData.addresses]);
            setUserOrders([...responseData.userOrders]);
        })
        .catch(error => ErrorAlert(error));
    }, []);

    const getCartProductByIndex = index => cart[index];
    const getCart = _ => cart;
    const updateCartProductQuantityByIndex = (index, quantity) => {
        cart[index].quantity = quantity;
        setCart([...cart]);
    }
    const deleteCartProductByIndex = index => {
        cart.splice(index, 1);
        setCart([...cart]);
    }

    const getAddresses = _ => addresses;
    const addAddress = newAddress => newAddress && setAddressess([...addresses, newAddress]);
    const removeAddressByIndex = index =>{
        addresses.splice(index, 1);
        setAddressess([ ...addresses ]);
    }

    const getUserOrders = _ => userOrders;

    const values = {
        getCartProductByIndex, 
        getCart, 
        updateCartProductQuantityByIndex, 
        deleteCartProductByIndex,
        getAddresses,
        getUserOrders,
        addAddress,
        removeAddressByIndex
    };

    return (
        <UserContext.Provider value={ values }>
            {children}
        </UserContext.Provider>
    );
}

export default UserState;
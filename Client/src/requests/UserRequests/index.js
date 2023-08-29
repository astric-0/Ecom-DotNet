import config from "../../Config";
import TokenHandler from "../../TokenHandler";

export const UserSignupRequest = payload => {
    return new Promise(async (resolve, reject) => {
        try {

            const { username, gender, doB, email, password } = payload;

            if (!username || !email || !password)
                throw new Error ('Missing values');
            else if (gender != '' && gender != 'male' && gender !='female' && gender != 'others')
                throw new Error ('Invalid values');
            else if (password.length < 8)
                throw new Error ('Password is too short');
            else if (username.includes(' '))
                throw new Error ('Username can\'t contain space');        

            const response = await fetch(config.path('/user/signup'), {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.status == 200)
                return resolve();

            throw new Error (await response.text());
        }
        catch (error) {
            return reject(error.message);
        }
    });
}

export const UserSigninRequest = payload => {
    return new Promise(async (resolve, reject) => {
        try {   
            const { username, password } = payload;

            if (!username || !password)
                throw new Error ('Missing Values');
            if (username.includes(' '))
                throw new Error ('Username can\'t contain space');
            if (password.length < 8)
                throw new Error ('Password is too short');

            const response = await fetch(config.path('/user/signin'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.status == 200) {
                const accessToken = await response.text();
                TokenHandler.deleteInfo();
                TokenHandler.setInfo({ accessToken, 'name': payload.username, 'accountType': 'user' });
                return resolve ();
            }

            throw new Error (await response.text());
        }
        catch(error) {
            return reject(error.message);
        }
    });
}

export const UserAddToCartRequest = productId => {
    return new Promise(async (resolve, reject) => {    
        try {            
            const accessToken = TokenHandler.getAccessToken();
            if (!accessToken)
                throw new Error("Access Token not found");

            const response = await fetch(config.path('/user/addtocart/' + productId), {
                headers: { accessToken }
            });

            if (response.status == 200)
                return resolve();            

            if (response.status == 403)
                TokenHandler.deleteInfo();

            throw new Error (await response.text());            
        }

        catch (error) {
            return reject (error.message);
        }
    })
}

export const UserGetCartRequest = _ => {
    return new Promise(async (resolve, reject) => {
        try {            
            const accessToken = TokenHandler.getAccessTokenOrError();
            const accountType = TokenHandler.getAccountType();
            
            if (accountType != 'user')
                throw new Error ('The account type doesn\'t have a cart');

            const response = await fetch(config.path('/user/getcart'), {
                headers: { accessToken }
            });

            if (response.status == 200)
                return resolve(await response.json());
            else if (response.status == 403)
                TokenHandler.deleteInfo();
            throw new Error (await response.text());
        }
        catch (error) {
            return reject(error.message);
        }
    })
}

export const UserIncreaseCartProductQuantity = async cardId =>
    await UserChangeCartProductQuantity(cardId, '/user/increasequantity/');

export const UserDecreaseCartProductQuantity = async cardId =>
    await UserChangeCartProductQuantity(cardId, '/user/decreasequantity/');

const UserChangeCartProductQuantity = (cartId, path) => {
    return new Promise(async (resolve, reject) => {
        try {
            const accessToken = TokenHandler.getAccessTokenOrError();
            const accountType = TokenHandler.getAccountTypeOrError();

            if (accountType != 'user')
                throw new Error ('This account type doesn\'t have cart');

            const response = await fetch(config.path(path + cartId),{
                headers: { accessToken }
            });

            if (response.status == 200)
                return resolve(await response.text());
            throw new Error(await response.text());
        }   
        catch (error) {
            return reject(error.message);
        }
    });
}

export const UserDeleteCartProduct = cartId => {
    return new Promise(async (resolve, reject) => {
        try {
            const accessToken = TokenHandler.getAccessTokenOrError();
            const response = await fetch(config.path('/user/deletecartproduct/' + cartId),{
                headers: { accessToken }
            });

            if (response.status == 200)
                return resolve();
            throw new Error(await response.text());
        }
        catch (error) {
            return reject(error.message);
        }
    });
}

export const UserGoogleSigninRequest = token => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!token) 
                throw new Error ("Token is empty");
            const response = await fetch(config.path("/user/googleauth"),{
                headers: { token }
            });

            if (response.status == 200) {
                const { name, token } = await response.json();
                console.log(name, token);
                TokenHandler.setInfo({ accessToken: token, name, 'accountType': 'user' });
                return resolve();
            }

            throw new Error(await response.text());
        }

        catch (error) {
            return reject(error.message);
        }
    })
}

export const UserOrderSingleProduct = payload => {
    return new Promise(async (resolve, reject) => {
        try {
            const { cartId, addressId, paymentMethod } = payload;
            const accessToken = TokenHandler.getAccessTokenOrError();

            if (!cartId || !addressId || !paymentMethod)
                throw new Error("Missing Values");
            else if (cartId < 0 || addressId < 0)
                throw new Error("Invalid Cart Id or Address Id");
            else if (paymentMethod != "UPI" && paymentMethod != "COD")
                throw new Error("Invalid Payment Method")                              

            const response = await fetch(config.path("/user/ordersingleproduct"), {
                method: "POST",
                headers: {
                    accessToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if(response.status == 200)
                return resolve();

            throw new Error(await response.text());
        }
        catch(error) {
            return reject(error.message);
        }
    })
}

export const UserAddAddressRequest = payload => {
    return new Promise(async (resolve, reject) => {
        try {
            const accessToken = TokenHandler.getAccessTokenOrError();
            const { phoneNumber, houseNumber, area, landMark, pinCode, city, state, type } = payload;

            if (!phoneNumber || phoneNumber.length != 10)
                throw new Error("Phone number is invalid");
            else if (!houseNumber)
                throw new Error("House Number is invalid");
            else if (!area)
                throw new Error("Area is invalid");            
            else if (!pinCode || pinCode.length != 6)
                throw new Error("Pincode is invalid");
            else if (!city)
                throw new Error("City is invalid");
            else if (!state)
                throw new Error("State is invalid");
            else if (!type || (type.toUpperCase() != 'HOME' && type.toUpperCase() != 'OFFICE'))
                throw new Error("Address Type is invalid");

            const response = await fetch(config.path("/user/saveaddress"), {
                method: "POST",
                headers: { 
                    accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.status == 200)
                return resolve(await response.json());
            throw new Error(await response.text());
        }       
        catch (error) {
            return reject(error);
        }
    })
}

export const UserDeleteAddressRequest = addressId => {
    return new Promise(async (resolve, reject) => {
        try {

            const accessToken = TokenHandler.getAccessTokenOrError();
            if (addressId < 0)
                throw new Error ("Invalid User Id");
            
            const response = await fetch(config.path("/user/deleteaddress/" + addressId), {
                method: "DELETE",
                headers: { accessToken }
            });

            if (response.status == 200)
                return resolve();

            throw new Error(await response.text());
        }
        catch (error) {
            return reject (error);
        }            
    });
}
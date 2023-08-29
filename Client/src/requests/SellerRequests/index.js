import config from "../../Config";
import TokenHandler from "../../TokenHandler";

export const SellerSignupRequest = payload => {
    return new Promise(async (resolve, reject) => {
        try{
            const { Sellername, Password, About, Address, Email } = payload;    
            if(!Sellername || !Password || !About || !Address || !Email)         
                throw new Error('Missing values');
            else if (Sellername.includes(' '))
                throw new Error('Seller name can\'t contain space')
            else if (Password.length < 8)
                throw new Error('Password too short');

            const response = await fetch(config.path('/seller/signup'), {
                method: 'POST',                
                headers: {  
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.status == 200)
                return resolve();
            throw new Error(await response.text());
        }
        catch(error){
            return reject (error.message);
        }
    });
}

export const SellerSigninRequest = payload => {
    return new Promise(async (resolve, reject) => {
        try {
            const { Password, Sellername } = payload;
            if (!Sellername || !Password)
                throw new Error ("Missing values");
            else if (Password.length < 8)
                throw new Error ("Password is too short");

            const response = await fetch(config.path('/seller/signin'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.status == 200){
                const accessToken = await response.text();
                TokenHandler.setInfo({ accessToken, name: payload.Sellername, accountType: "seller" })
                return resolve();
            }

            throw new Error(await response.text());
        }
        catch (error) {
            return reject(error.message);
        }
    })
}

const ValidProductPayloadOrError = payload => {
    const { productName, details, category, price, stock, Image, imageIgnoreFlag } = payload;
    if (!productName || !details || !category || !price)
        throw new Error ("Missing values");
    else if (isNaN(price))
        throw new Error ("Price should be a number");
    else if (isNaN(stock))
        throw new Error ("Stock should be a number");
    else if (!imageIgnoreFlag && (!Image || !Image?.name))
        throw new Error ("Image can't be null");
}

export const SellerAddNewProductRequest = payload => {
    return new Promise (async (resolve, reject) => {
        try{
            const accessToken = TokenHandler.getAccessTokenOrError();

            ValidProductPayloadOrError(payload);
            const { productName, details, category, price, stock, Image } = payload;            

            const formData = new FormData();
            formData.append('ProductName', productName);
            formData.append('Details', details);
            formData.append('Category', category);
            formData.append('Price', price);
            formData.append('Stock', stock);
            formData.append('Image', Image, Image.name);
            formData.append('Filename', Image.name);
            formData.append('ImageIgnoreFlag', false);

            const response = await fetch(config.path('/seller/addproduct'), {
                method: 'POST',
                headers: { accessToken },
                body: formData
            });

            console.log(response.status);
            if (response.status == 200){
                const data = await response.json();                
                return resolve(data);
            }

            throw new Error(await response.text());
        }
        catch (error) {
            return reject(error.message);
        }
    });
}

export const SellerGetAllProductsRequest = _ => {
    return new Promise(async (resolve, reject) => {
        try{
            const accessToken = TokenHandler.getAccessTokenOrError();
            const response = await fetch(config.path('/seller/getproducts'), {
                headers: { accessToken }
            });

            if (response.status == 200) 
                return resolve(await response.json());

            throw new Error(await response.text());
        }   
        catch(error){
            return reject(error.message);
        }        
    });
}

export const SellerDeleteProductRequest = ProductId => {
    return new Promise(async (resolve, reject) => {
        try{
            const accessToken = TokenHandler.getAccessTokenOrError();

            if (!ProductId || ProductId < 0)
                throw new Error("Product Id can't be null or negative");
            const response = await fetch(config.path('/seller/deleteproduct/' + ProductId), {                
                method: 'DELETE',
                headers: { accessToken }
            });

            if (response.status == 200)
                return resolve();
            throw new Error(await response.text());
        }
        catch(error){   
            return reject(error.message);
        }        
    })
}

export const SellerUpdateProductRequest = payload => {
    return new Promise(async (resolve, reject) => {
        try {                        
            const accessToken = TokenHandler.getAccessTokenOrError();
            ValidProductPayloadOrError(payload);
            const { productId, productName, details, category, price, stock, Image, filename, imageIgnoreFlag } = payload;            

            if (productId == null || productId < 1)
                throw new Error ('Product Id can\'t be null or negative');

            const formData = new FormData();
            formData.append('ProductId', productId);
            formData.append('ProductName', productName);
            formData.append('Details', details);
            formData.append('Category', category);
            formData.append('Price', price);
            formData.append('Stock', stock);
            formData.append('imageIgnoreFlag', imageIgnoreFlag);

            if (!imageIgnoreFlag) {
                formData.append('Image', Image, Image.name);
                formData.append('Filename', Image.name);
            }
            else
                formData.append('Filename', filename);        

            const response = await fetch(config.path('/seller/updateproduct'), {
                method: 'POST',
                headers: { accessToken },
                body: formData
            });

            console.log(response.status);
            if (response.status == 200)
                return resolve();
            throw new Error (await response.text());
        }
        catch (error) {
            return reject(error.message);
        }
    });
}
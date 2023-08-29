//import TokenHandler from "../../TokenHandler";
import config from "../../Config";

export const HomeGetAllProductsRequest = _ => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(config.path('/home/getallproducts'));
            if (response.status == 200)
                return resolve(await response.json());            
            throw new Error (await response.text());
        }
        catch (error) {
            return reject (error.message);
        }
    });
}

const HomeGetSellerDataRequest = path => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(config.path(path));
            if (response.status == 200)
                return resolve(await response.json());
            throw new Error (await response.text());
        }
        catch(error) {
            return reject(error.message);
        }
    });
}

export const HomeGetSellerDataBySellerId = sellerId => HomeGetSellerDataRequest('/home/getsellerdatabysellerid/' + sellerId);
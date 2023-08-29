import TokenHandler from "../../TokenHandler";
import config from "../../Config";

export const VerifyTokenRequest = _ => {
    return new Promise(async (resolve, reject) => {
        try {
            const accessToken = TokenHandler.getAccessTokenOrError();
            const accountType = TokenHandler.getAccountTypeOrError();

            const response = await fetch(config.path(`/${accountType}/verifytoken`), {
                headers: { accessToken }
            });

            if (response.status == 200) {                
                TokenHandler.setName(await response.text());
                return resolve();
            }

            else if (response.status == 403) {
                TokenHandler.deleteInfo();    
                throw new Error ("Access Token Invalid: " + await response.text());
            }

            throw new Error(await response.text());
        }

        catch (error) {            
            return reject (error.message);
        }
    });
}
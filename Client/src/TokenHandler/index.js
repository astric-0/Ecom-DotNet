class TokenHandler {
    static setInfo = ({ accessToken, name, accountType }) => {  
        this.setAccessToken(accessToken);
        this.setName(name);
        this.setAccountType(accountType);
    }

    static setAccessToken = accessToken => 
        localStorage.setItem("accessToken", accessToken);    

    static setName = name =>
        localStorage.setItem("name", name);      

    static setAccountType = accountType =>
        localStorage.setItem("accountType", accountType);

    static getAccessToken = _ => localStorage.getItem("accessToken");
    static getName = _ => localStorage.getItem("name");
    static getAccountType = _ => localStorage.getItem("accountType");

    static getAccessTokenOrError = _ => {
        const accessToken = this.getAccessToken();
        if (!accessToken)
            throw new Error ("Access Token is empty");
        return accessToken;
    }

    static getAccountTypeOrError = _ => {
        const accountType = this.getAccountType();
        if (!accountType)
            throw new Error ("Account type is empty or invalid");
        return accountType;
    }

    static getInfo = _ => {
        const accessToken = this.getAccessToken();
        const name = this.getName();
        const accountType = this.getAccountType();

        return { accessToken, name, accountType };
    }

    static deleteInfo = _ => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("name");
        localStorage.removeItem("accountType");
    }
}

export default TokenHandler;
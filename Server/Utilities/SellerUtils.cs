//using Server.Model;
using BC = BCrypt.Net.BCrypt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
//using Microsoft.Extensions.Hosting.Internal;

namespace SellerUtils
{
    public class ExtendedProduct : Server.Model.Product
    {
        public IFormFile? Image { get; set; }
        public bool ImageIgnoreFlag { get; set; }
        public bool IsValidOrException()
        {
            if (string.IsNullOrEmpty(this.ProductName))
                throw new CommonUtils.HttpStatusException(400, "Product name is null");
            if (string.IsNullOrEmpty(this.Details))
                throw new CommonUtils.HttpStatusException(400, "Product details are null");
            if (string.IsNullOrEmpty(this.Category))
                throw new CommonUtils.HttpStatusException(400, "Product category is null");
            if (this.Stock < 0)                
                throw new CommonUtils.HttpStatusException(400, "Product stock can't be negative");
            if (this.Price < 0)
                throw new CommonUtils.HttpStatusException(400, "Product price can't be negative");
            if (!this.ImageIgnoreFlag && this.Image == null)
                throw new CommonUtils.HttpStatusException(400, "Product image can't be empty");

            return true;
        }        
    }

    public class SellerLogin 
    {
        public string? Sellername { get; set; }
        public string? Password { get; set; }
        public Server.Model.Seller? SellerData { get; set; }

        public Server.Model.Seller IsValidOrException (Server.Model.EcomContext? context) {
            if (context == null)
                throw new Exception("Data base is not connected");

            if (string.IsNullOrEmpty(this.Sellername) || string.IsNullOrEmpty(this.Password))
                throw new InvalidDataException("Missing values");

            else if (this.Password.Length < 8)
                throw new InvalidDataException("Password too short");

            Server.Model.Seller? sellerData = context.Sellers.FirstOrDefault(sellerAccount => 
                this.Sellername == sellerAccount.SellerName
            ) ?? throw new InvalidDataException("Sellername not found");

            string? hashPassword = sellerData.Password;
            if(!BC.Verify(this.Password, hashPassword))
                throw new InvalidDataException("Password doesn't match");

            this.SellerData = sellerData;
            return sellerData;
        }        

        public string GenerateToken(string securityKeyString) {

            if (this.SellerData == null)
                throw new InvalidDataException("Seller data not found");

            SymmetricSecurityKey key = new (Encoding.UTF8.GetBytes(securityKeyString));
            SigningCredentials cred = new (key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityTokenHandler().CreateToken(new SecurityTokenDescriptor
            {                
                Subject = new ClaimsIdentity(new[] { new Claim("Sellername", this.SellerData.SellerName), new Claim("SellerId", this.SellerData.SellerId.ToString()), new Claim("AccountType", "seller") }),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = cred
            });

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }    

    public static class StaticUtils 
    {
        public static Server.Model.Seller VerifyTokenOrException (string? accessToken, string securityKeyString, Server.Model.EcomContext? context)
        {
            if (string.IsNullOrEmpty(accessToken))
                throw new CommonUtils.HttpStatusException(403, "AccessToken not found");
            if (string.IsNullOrEmpty(securityKeyString))
                throw new CommonUtils.HttpStatusException(500, "Internal Error: key string is empty or null");
            if (context == null)
                throw new CommonUtils.HttpStatusException(500, "Internal Error: context is null");

            try
            {
                JwtSecurityTokenHandler handler = new();
                SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(securityKeyString));
                handler.ValidateToken(accessToken, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false,                    
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                JwtSecurityToken jwtToken = (JwtSecurityToken)validatedToken;
                int? SellerId = Convert.ToInt32(jwtToken.Claims.First(x => x.Type == "SellerId").Value);

                if (SellerId == null)
                    throw new Exception("SellerId not found in Access Token");

                Server.Model.Seller sellerData = context.Sellers.Find(SellerId)
                ?? throw new Exception("Seller Data not found in database");

                return sellerData;
            }
            catch (Exception exception)
            {
                throw new CommonUtils.HttpStatusException(403, exception.Message);
            }
        }

        public static string ExceptionIsValid (Server.Model.Seller obj)
        {
            if (
                    string.IsNullOrEmpty(obj.SellerName) || 
                    string.IsNullOrEmpty(obj.About) || 
                    string.IsNullOrEmpty(obj.Address) || 
                    string.IsNullOrEmpty(obj.Email) || 
                    string.IsNullOrEmpty(obj.Password)
                )
                throw new InvalidOperationException("Missing values");
            else if (obj.SellerName.Contains(' '))
                throw new InvalidOperationException("Sellername can't contain space");
            else if (obj.Password.Length < 8)
                throw new InvalidDataException("Password is too short");            
            return "Success";
        }

        public static bool ExceptionIsNew(Server.Model.Seller newSeller, Server.Model.EcomContext? context)
        {
            if (context == null)
                throw new Exception("Context is empty");

            Server.Model.Seller? oldSeller = context.Sellers.FirstOrDefault(sellerAccount => 
                sellerAccount.SellerName==newSeller.SellerName
            );

            if(oldSeller != null)
                throw new InvalidDataException("Sellername already exist");

            return true;
        }

        public static bool IsNew(Server.Model.Seller newSeller, Server.Model.EcomContext context)
        {
            Server.Model.Seller? oldSeller = context.Sellers.FirstOrDefault(sellerAccount => 
                sellerAccount.SellerName==newSeller.SellerName
            );
            return oldSeller == null;
        }
    }
}
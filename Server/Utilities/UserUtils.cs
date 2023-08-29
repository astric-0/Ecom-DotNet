using CommonUtils;
using BC = BCrypt.Net.BCrypt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using DBoperations;

namespace UserUtils 
{
    public class UserLogin {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public Server.Model.User? UserData { get; set; }
        public bool IsValidOrException(Server.Model.EcomContext? context)
        {
            if (context == null) 
                throw new HttpStatusException(500, "Database is not connected");

            if (string.IsNullOrEmpty(this.Username) || string.IsNullOrEmpty(this.Password))
                throw new HttpStatusException(400, "Missing Value(s)");

            if (this.Username.Contains(' '))
                throw new HttpStatusException(400, "Username can't contain space");

            if (this.Password.Length < 8)
                throw new HttpStatusException(400, "Password is too short");

            Server.Model.User? userData = context.Users.FirstOrDefault(userAccount => 
                this.Username == userAccount.Username
            ) ?? throw new InvalidDataException("Username not found");

            string? hashPassword = userData.Password;
            if(!BC.Verify(this.Password, hashPassword))
                throw new InvalidDataException("Password doesn't match");

            this.UserData = userData;
            return true;
        }

        public string GenerateToken(string securityKeyString) 
        {

            if (this.UserData == null)
                throw new InvalidDataException("User data not found");

            SymmetricSecurityKey key = new (Encoding.UTF8.GetBytes(securityKeyString));
            SigningCredentials cred = new (key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityTokenHandler().CreateToken(new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] 
                {
                    new Claim("Username", this.UserData.Username),
                    new Claim("UserId", this.UserData.UserId.ToString()), 
                    new Claim("AccountType", "user")
                }),

                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = cred
            });

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static string MakeToken(string name, int userId, string securityKeyString) 
        {

            if (string.IsNullOrEmpty(name))
                throw new InvalidDataException("Username not found");

            if (string.IsNullOrEmpty(securityKeyString))
                throw new HttpStatusException(500, "Security key is missing");

            SymmetricSecurityKey key = new (Encoding.UTF8.GetBytes(securityKeyString));
            SigningCredentials cred = new (key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityTokenHandler().CreateToken(new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] 
                {
                    new Claim("Username", name),
                    new Claim("UserId", userId.ToString()), 
                    new Claim("AccountType", "user")
                }),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = cred
            });

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public static class StaticUtils {
        public static Server.Model.User VerifyTokenOrException (string? accessToken, string securityKeyString, Server.Model.EcomContext? context)
        {
            if (string.IsNullOrEmpty(accessToken))
                throw new HttpStatusException(403, "AccessToken not found");
            if (string.IsNullOrEmpty(securityKeyString))
                throw new HttpStatusException(500, "Internal Error: key string is empty or null");
            if (context == null)
                throw new HttpStatusException(500, "Internal Error: context is null");

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
                int? UserId = Convert.ToInt32(jwtToken.Claims.First(x => x.Type == "UserId").Value);

                if (UserId == null)
                    throw new HttpStatusException(403, "UserId not found in Access Token");

                Server.Model.User userData = context.Users?.Find(UserId)
                ?? throw new HttpStatusException(403, "User Data not found in database");
                //Server.Model.User userData = UserDBOpertions.GetUserByUserId(UserId);

                return userData;
            }
            catch (Exception exception)
            {
                throw new HttpStatusException(403, exception.Message);
            }
        }

        public static Server.Model.User VerifyTokenByConnectionStringOrException (string? accessToken, string securityKeyString, string connectionString)
        {
            if (string.IsNullOrEmpty(accessToken))
                throw new HttpStatusException(403, "AccessToken not found");
            if (string.IsNullOrEmpty(securityKeyString))
                throw new HttpStatusException(500, "Internal Error: key string is empty or null");
            if (string.IsNullOrEmpty(connectionString))
                throw new HttpStatusException(500, "Internal Error: connection string is empty or null");

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
                int? UserId = Convert.ToInt32(jwtToken.Claims.First(x => x.Type == "UserId").Value);

                Server.Model.User userData = UserDBOpertions.GetUserByUserId(UserId ?? throw new Exception("Invalid Token"), connectionString);

                return userData;
            }
            catch (Exception exception)
            {
                throw new HttpStatusException(403, exception.Message);
            }
        }
    }

    public class ExtendedUser : Server.Model.User
    {
        public bool IsValidOrException ()
        {
            if (string.IsNullOrEmpty(this.Username) || string.IsNullOrEmpty(this.Email) || string.IsNullOrEmpty(this.Password))            
                throw new HttpStatusException(400, "Missing Value(s)");

            if (this.Password.Length < 8)
                throw new HttpStatusException(400, "Password is too short");

            if (!string.IsNullOrEmpty(this.Gender) && this.Gender != "male" && this.Gender != "female" && this.Gender != "others")
                throw new HttpStatusException(400, "Invalid Value");

            if (this.DoB != null && this.DoB > DateTime.Today)
                throw new HttpStatusException(400, "Invalid Date of birth");

            if (this.Username.Contains(' '))
                throw new HttpStatusException(400, "Username can't contain space");

            return true;
        }
    }
}
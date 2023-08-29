using Microsoft.AspNetCore.Mvc;
using Server.Model;
using BC = BCrypt.Net.BCrypt;
using CommonUtils;
using DBoperations;
using Google.Apis.Auth;
using UserUtils;
using System.Data;
using Newtonsoft.Json;
using Server.Models;

namespace Server.Controllers
{
    public class UserController : Controller
    {
        private readonly EcomContext? _context;        
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;
        private readonly EmailService _emailService;

        public UserController (EcomContext context, IConfiguration configuration, IWebHostEnvironment environment, EmailService emailService)
        {
            this._context = context;
            this._configuration = configuration;
            this._environment = environment;
            this._emailService = emailService; 
        }

        private string GetConnectionString()
        {
            return this._configuration.GetConnectionString("EcomConnection")
            ?? throw new HttpStatusException(500, "Database is not connected");
        }

        private string GetSecuirtyKey ()
        {
            return this._configuration.GetSection("Jwt:Security").Value 
            ?? throw new HttpStatusException(500, "Security key is null");
        }

        public void CheckContext ()
        {
            if(this._context == null)
                throw new HttpStatusException(500, "Internal Error: Database is not connected");
        }

        private User CheckTokenOrException ()
        {
            string securityKeyString = this.GetSecuirtyKey();
            string? accessToken = Request.Headers["accessToken"];            
            return StaticUtils.VerifyTokenOrException(accessToken, securityKeyString, this._context);
        }

        [HttpPost]
        [Route("/user/signup")]
        public IActionResult Signup([FromBody] ExtendedUser userData)
        {
            try 
            {
                this.CheckContext();      
                _ = userData.IsValidOrException();

                User? oldUser = this._context?.Users.FirstOrDefault(u => u.Username == userData.Username);

                if (oldUser != null)
                    throw new HttpStatusException(400, "Username is already taken");

                userData.Password = BC.HashPassword(userData.Password);
                userData.AuthType = "NATIVE";
                this._context?.Users.Add(userData);
                this._context?.SaveChanges();                

                return Ok();
            }
            catch (HttpStatusException exception) 
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch (Exception exception) 
            {
                Console.WriteLine(exception);
                return StatusCode(500, exception.Message);
            }
        }
   
        [HttpPost]
        [Route("/user/signin")]
        public IActionResult Signin([FromBody] UserLogin userLoginData)
        {
            try
            {
                this.CheckContext();
                _ = userLoginData.IsValidOrException(this._context);
                string accessToken = userLoginData.GenerateToken(this.GetSecuirtyKey());
                return Content(accessToken);
            }
            catch (HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch (Exception exception)
            {                
                return StatusCode(500, exception.Message);
            }
        }        

        [HttpGet]
        [Route("/user/verifytoken")]
        public IActionResult VerifyToken () 
        {
            try
            {
                this.CheckContext();
                string securityKeyString = this.GetSecuirtyKey();
                string connectionString = this.GetConnectionString();
                string? accessToken = Request.Headers["accessToken"];

                User userData = StaticUtils.VerifyTokenByConnectionStringOrException(accessToken, securityKeyString, connectionString);

                return Ok(userData.FirstName ?? userData.Username);
            }
            catch (HttpStatusException exception)
            {                
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpGet]
        [Route("/user/addtocart/{productId}")]
        public IActionResult AddToCart(int productId)
        {
            try
            {
                this.CheckContext();
                User userData =  this.CheckTokenOrException();

                Product? productData = (this._context?.Products.Find(productId)) ?? throw new HttpStatusException(400, "Product not found");
                UserCart? cartProductData = this._context?.UserCarts.FirstOrDefault(c => c.ProductId == productId && c.UserId == userData.UserId);

                if(cartProductData != null)
                    throw new HttpStatusException(400, "Product is already in the cart");

                UserCart userCartData = new() { ProductId = productId, UserId = userData.UserId };
                this._context?.UserCarts.Add(userCartData);
                this._context?.SaveChanges();

                return Ok();
            }
            catch(HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch(Exception exception)
            {
                return StatusCode(500, exception.Message);
            }
        }
                
        [HttpGet]
        [Route("/user/getcart")]
        public IActionResult GetCart() {
            try 
            {
                this.CheckContext();
                User userData = this.CheckTokenOrException();                

                var cartData = (from cartItem in this._context?.UserCarts
                    join productData in this._context?.Products ?? throw new HttpStatusException(500, "Data base error") 
                    on  cartItem.ProductId equals productData.ProductId
                    where cartItem.UserId == userData.UserId 
                    select new
                    {
                        productData.ProductId,
                        productData.ProductName,
                        productData.Details,
                        productData.Category,
                        productData.Price,
                        productData.Stock,
                        productData.Filename,
                        productData.SellerId,
                        cartItem.CartId,
                        cartItem.Quantity
                    }).ToList();

                string connectionString = this.GetConnectionString();

                List<Address> addresses = UserDBOpertions.GetUserAddresses(userData.UserId, connectionString);
                List<UserOrder> userOrders = UserDBOpertions.GetUserOrders(userData.UserId, connectionString);                            

                return Json(new { cartData, addresses, userOrders });                
            }
            catch (HttpStatusException exception)
            {
                return StatusCode (exception.StatusCode, exception.Message);
            }
            catch (Exception exception) 
            {
                return StatusCode (500, exception.Message);
            }            
        }

        [HttpGet]
        [Route("/user/increasequantity/{cartId}")]
        public IActionResult IncreaseQuantity(int cartId)
        {
            try
            {                
                this.CheckContext();
                this.CheckTokenOrException();

                int quantity = UserDBOpertions.IncreaseQuantityOrException(cartId, this.GetConnectionString());                
                return Ok(quantity);
            }
            catch(HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch(Exception exception)
            {
                return StatusCode(500, exception.Message);
            }
        }

        [HttpGet]
        [Route("/user/decreasequantity/{cartId}")]
        public IActionResult DecreaseQuantity(int cartId)
        {
            try
            {                
                this.CheckContext();
                this.CheckTokenOrException();

                int quantity = UserDBOpertions.DecreaseQuantityOrException(cartId, this.GetConnectionString());
                return Ok(quantity);
            }
            catch(HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch(Exception exception)
            {
                return StatusCode(500, exception.Message);
            }
        }

        [HttpGet]
        [Route("/user/deletecartproduct/{cartId}")]
        public IActionResult DeleteCartProduct(int cartId)
        {
            try
            {
                this.CheckContext();
                this.CheckTokenOrException();

                int changedRows = UserDBOpertions.DeleteCartProduct(cartId, this.GetConnectionString());
                if (changedRows == 0)
                    throw new HttpStatusException(400, "Couldn't find the CartId");
                return Ok();
            }
            catch(HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch(Exception exception)
            {
                return StatusCode(500, exception.Message);
            }
        }

        [HttpGet]
        [Route("/user/googleauth")]
        public async Task<IActionResult> GoogleAuth()
        {
            try
            {
                string? token = Request.Headers["token"];

                if (string.IsNullOrEmpty(token))
                    throw new Exception("TOKEN IS EMPTY OR NULL");

                GoogleJsonWebSignature.ValidationSettings validationSettings = new();                
                GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token, validationSettings);

                int userId = UserDBOpertions.RegisterGoogleUser(payload, this.GetConnectionString());

                if (userId == -1) 
                {
                    User userDataObj = UserDBOpertions.GetUserByEmail(payload.Email, this.GetConnectionString());
                    return Json
                    (
                        new 
                        {
                            name = userDataObj.FirstName ?? userDataObj.Username,
                            token = UserLogin.MakeToken(userDataObj.Username, userDataObj.UserId, this.GetSecuirtyKey())
                        }
                    );
                }

                else return Json
                (
                    new 
                    {
                        name = payload.GivenName,
                        token = UserLogin.MakeToken(payload.GivenName, userId, this.GetSecuirtyKey()),
                    }
                );

                
            }
            catch(HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch(Exception exception)
            {
                return StatusCode(500, exception.Message); 
            }
        }

        [HttpPost]
        [Route("/user/ordersingleproduct")]
        public IActionResult OrderSingleProduct([FromBody] CartRequestBody data)
        {
            try
            {
                data.IsValidOrException();
                User userData = this.CheckTokenOrException();                
                int orderId = UserDBOpertions.OrderSingleProduct(data, this.GetConnectionString());

                if (orderId == -1)
                    throw new Exception("Some Error Occured");

                _ = this._emailService.SendEmail
                (
                    userData.Email, 
                    "Order Placed", 
                    @$"
                        <h3> 
                            Order placed for User { userData.Username }
                            With OrderId : { orderId }
                        </h3>
                    "
                );

                return Ok();
            }
            catch(HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch(Exception exception)
            {
                return StatusCode(500, exception.Message);
            }
        }
    
        [HttpPost]
        [Route("/user/saveaddress")]
        public IActionResult SaveAddress([FromBody] ExtendedAddress addressObj)
        {
            try
            {
                int userId = this.CheckTokenOrException().UserId;
                Address newAddress = addressObj
                    .IsValidOrException()
                    .SaveOrException(this.GetConnectionString(), userId);

                return Json(newAddress);
            }
            catch(HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch(Exception exception)
            {
                return StatusCode(500, exception.Message);
            }
        }
    
        [HttpDelete]
        [Route("/user/deleteaddress/{addressId}")]
        public IActionResult DeleteAddress(int addressId)
        {
            try
            {
                if (addressId < 0)
                    throw new Exception ("Invalid Address Id");

                int userId = this.CheckTokenOrException().UserId;

                if (ExtendedAddress.DeleteAddress(this.GetConnectionString(), userId, addressId) == 0)
                    throw new HttpStatusException(400, "Couldn't find User Or Address Or Combination");

                return Ok();
            }
            catch(HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch(Exception exception)
            {
                return StatusCode(500, exception.Message);
            }
        }
    }
}
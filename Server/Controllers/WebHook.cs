using CommonUtils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using Server.Model;
using UserUtils;
using DBoperations;

namespace Server.Controllers;

public class StripeWebHook: Controller
{
    private readonly string localSecret = "whsec_20f64cdfa16147620030b44ec8a5d235dbf3fdb80accbf43d2abf5d1b7c82dae";
    private readonly StripeOptions _sOptions;
    private readonly IConfiguration _configuration;
    private readonly EcomContext _context;
    private readonly EmailService _emailService;

    public StripeWebHook(IOptions<StripeOptions> sOptions, EcomContext context, IConfiguration configuration, EmailService emailService)
    {
        this._sOptions = sOptions.Value;
        StripeConfiguration.ApiKey = _sOptions.SecretKey;
        this._configuration = configuration;
        this._context = context;
        this._emailService = emailService;
    }

    public string GetConnectionString()
    {
        return this._configuration.GetConnectionString("EcomConnection")
        ?? throw new HttpStatusException(500, "Connection String is null");
    }

    public string GetSecuirtyKey()
    {
        return this._configuration.GetSection("Jwt:Security").Value 
        ?? throw new HttpStatusException(500, "Security key is null");
    }
    
    private User CheckTokenOrException ()
    {
        string securityKeyString = this.GetSecuirtyKey();
        string? accessToken = Request.Headers["accessToken"];            
        return StaticUtils.VerifyTokenOrException(accessToken, securityKeyString, this._context);
    }

    [HttpPost]
    [Route("create-payment")]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentRequest request)
    {
        try
        {   
            User userData = this.CheckTokenOrException();
            _ = request ?? throw new HttpStatusException(400, "Request Is Null");

            UserCart userCartData = UserDBOpertions.GetCartProductById(userData.UserId, request.CartId, this.GetConnectionString())
            ?? throw new HttpStatusException(400, "Cart Data Not Found");

            _ = userCartData.Product ?? 
            throw new HttpStatusException(500, "Product Data Not Found");
            
            var options = new PaymentIntentCreateOptions 
            {
                Amount = userCartData.Product.Price * 100,
                Currency = "inr",
                PaymentMethodTypes = new List<string>{ "card" },
                Metadata = new Dictionary<string, string>
                {
                    { "cart_id", request.CartId.ToString() },
                    { "user_id", userData.UserId.ToString() },
                    { "user_email", userData.Email },
                    { "username", userData.Username },
                    { "address_id", request.AddressId.ToString() }                    
                }
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);            
            return Ok(new { paymentIntent.ClientSecret });
        }

        catch(HttpStatusException exception)
        {
            return StatusCode(exception.StatusCode, exception.Message);
        }

        catch(Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpPost]
    [Route("webhook")]
    public async Task<IActionResult> Index()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        try
        {
            //var stripeEvent = EventUtility.ParseEvent(json);
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], this.localSecret);
            var paymentIntent = stripeEvent.Data.Object as PaymentIntent;            
            
            Console.WriteLine("Stripe Event: " + stripeEvent.Type);

            if (stripeEvent.Type == PaymentEvents.Created)
            {
                int amount = Convert.ToInt32
                (
                    paymentIntent?.Amount 
                    ?? throw new Exception("Amount is empty")
                );

                if (amount < 100)
                    throw new Exception("Invalid Amount");
            }

            else if (stripeEvent.Type == PaymentEvents.Succeeded)
            {
                int amount = Convert.ToInt32(paymentIntent?.Amount ?? throw new Exception("Amount is empty")) / 100;
                int userId = Convert.ToInt32(paymentIntent?.Metadata["user_id"] ?? throw new Exception("Amount is empty"));
                int cartId = Convert.ToInt32(paymentIntent?.Metadata["cart_id"] ?? throw new Exception("Amount is empty"));
                int addressId = Convert.ToInt32(paymentIntent?.Metadata["address_id"] ?? throw new Exception("Amount is empty"));

                string userEmail = paymentIntent.Metadata["user_email"]
                ?? throw new Exception("User Email Not Found");
                string username = paymentIntent.Metadata["username"]
                ?? throw new Exception("Username Not Found");
                
                Console.WriteLine("User Email: " + userEmail);

                int orderId = UserDBOpertions.OrderSingleProduct
                (
                    new CartRequestBody 
                    { 
                        AddressId = addressId, 
                        CartId = cartId, 
                        PaymentMethod = "CARD"
                    },
                    this.GetConnectionString()
                );                

                if (orderId == -1)
                    throw new Exception("Some Error Occured");
                else
                {
                    _ = this._emailService.SendEmail
                    (
                        userEmail, 
                        "Order Placed", 
                        @$"
                            <h3> 
                                Order placed for User { username }
                                With OrderId : { orderId }
                            </h3>
                        "
                    );
                }
            }
            
            return Ok();
        }
        catch (Exception exception)
        {
            Console.WriteLine("STRIPE ERROR: " + exception.Message);
            return BadRequest(exception.Message);
        }
    }
}

public class PaymentRequest 
{
    public int Amount { get; set; }
    public int CartId { get; set; }
    public int AddressId { get; set; }
}

public static class PaymentEvents
{
    public static string Created { get; } = "payment_intent.created";
    public static string Succeeded { get; } = "payment_intent.succeeded";
    public static string Failed { get; } = "payment_intent.failed";
    public static string Canceled { get; } = "payment_intent.canceled";
}
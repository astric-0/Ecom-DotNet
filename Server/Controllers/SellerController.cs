using System.Diagnostics;
using CommonUtils;
using DBOperations;
using Microsoft.AspNetCore.Mvc;
using Server.Model;
using BC = BCrypt.Net.BCrypt;

namespace Server.Controllers
{
    public class SellerController : Controller
    {
        private readonly EcomContext? _context;        
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;

        public SellerController (EcomContext context, IConfiguration configuration, IWebHostEnvironment environment)
        {
            this._context = context;
            this._configuration = configuration;
            this._environment = environment;
        }

        private string GetSecuirtyKey ()
        {
            return this._configuration.GetSection("Jwt:Security").Value 
            ?? throw new CommonUtils.HttpStatusException(500, "Security key is null");
        }

        public string GetConnectionString()
        {
            string? connectionString = this._configuration?.GetConnectionString("EcomConnection");
            if (string.IsNullOrEmpty(connectionString))
                throw new HttpStatusException(500, "Connection string is empty");
            return connectionString;
        }

        public void CheckContext ()
        {
            if(this._context == null)
                throw new CommonUtils.HttpStatusException(500, "Internal Error: Database is not connected");
        }

        public IActionResult Index()
        {
            return View();
        }

        public Seller VerifyTokenOrException()
        {
            string securityKeyString = this.GetSecuirtyKey();
            string? accessToken = Request.Headers["accessToken"];
            Console.WriteLine(accessToken);
            Seller sellerData = SellerUtils.StaticUtils.VerifyTokenOrException(accessToken, securityKeyString, this._context);
            return sellerData;
        }

        [HttpPost]
        [Route("/seller/signup")]
        public IActionResult Signup([FromBody] Seller sellerData)
        {
            try 
            {
                this.CheckContext();

                _ = SellerUtils.StaticUtils.ExceptionIsValid(sellerData);
                _ = SellerUtils.StaticUtils.ExceptionIsNew(sellerData, this._context);

                sellerData.Password = BC.HashPassword(sellerData.Password);
                this._context?.Sellers.Add(sellerData);            
                this._context?.SaveChanges();

                return Ok();
            }
            catch (InvalidDataException exception) 
            {
                return BadRequest(exception.Message);
            }
            catch (Exception exception) 
            {
                return StatusCode(500, exception.Message);
            }
        }
    
        [HttpPost]
        [Route("/seller/signin")]
        public IActionResult Signin([FromBody] SellerUtils.SellerLogin loginData)
        {
            try
            {
                this.CheckContext();
                _ = loginData.IsValidOrException(this._context);

                string? securityKeyString = this.GetSecuirtyKey();
                string token = loginData.GenerateToken(securityKeyString);

                return Content(token);
            }
            catch(InvalidDataException exception)
            {
                return BadRequest(exception.Message);
            }
            catch(Exception exception)
            {
                return StatusCode(500, exception.Message);
            }
        }

        [HttpPost]
        [Route("/seller/addproduct")]
        public async Task<IActionResult> AddProduct([FromForm] SellerUtils.ExtendedProduct product)
        {
            try
            {
                _ = product.IsValidOrException();
                this.CheckContext();

                string securityKeyString = this.GetSecuirtyKey();
                string? accessToken = Request.Headers["accessToken"];
                Seller sellerData = SellerUtils.StaticUtils.VerifyTokenOrException(accessToken, securityKeyString, this._context);

                if (product.Image == null)
                    throw new CommonUtils.HttpStatusException(400, "Image Is Empty");

                string uniqueFilename = await CommonUtils.ImageService.SaveImage(product.Image, this._environment);
                product.Filename = uniqueFilename;
                product.SellerId = sellerData.SellerId;

                _ = this._context?.Add(product);
                _ = this._context?.SaveChanges();

                var data = new {
                    filename = uniqueFilename,
                    product.ProductId
                };                

                return Ok(data);
            }
            catch (CommonUtils.HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch (Exception exception)
            {
                return StatusCode(500, exception.Message);
            }
        }

        [HttpGet]
        [Route("/seller/getproducts")]
        public IActionResult GetProducts()
        {
            try
            {
                this.CheckContext();
                string securityKeyString = this.GetSecuirtyKey();
                string? accessToken = Request.Headers["accessToken"];
                Seller sellerData = SellerUtils.StaticUtils.VerifyTokenOrException(accessToken, securityKeyString, this._context);

                var products = (from product in this._context?.Products where product.SellerId == sellerData.SellerId select new 
                {
                    product.ProductName,
                    product.ProductId,
                    product.Details,
                    product.Category,
                    product.Stock,
                    product.Price,
                    product.Filename
                }).ToList();                                

                return Json(products);
            }
            catch(CommonUtils.HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch(Exception exception)
            {
                return StatusCode(500, exception.Message);
            }            
        }

        [HttpDelete]
        [Route("/seller/deleteproduct/{ProductId}")]
        public IActionResult DeleteProduct(int ProductId) 
        {
            try
            {
                if (ProductId < 0)
                    throw new HttpStatusException(400, "Product Id can't be negative");                

                int sellerId = this.VerifyTokenOrException().SellerId;

                string connectionString = this.GetConnectionString();
                Product productToDelete = SellerDBOPerations.GetProductById(connectionString, ProductId, sellerId)
                ?? throw new HttpStatusException(400, "Product Not Found");                

                if (SellerDBOPerations.DeleteProduct(this.GetConnectionString(), ProductId, sellerId) == 0)
                    throw new HttpStatusException(500, "Couldn't delete requested product");

                if (!string.IsNullOrEmpty(productToDelete.Filename))
                    ImageService.DeleteImage(this._environment, productToDelete.Filename);

                //this.CheckContext();
                //Product? productToDelete = this._context?.Products.Find(ProductId)
                //?? throw new CommonUtils.HttpStatusException(400, "Product To Delete Not Found");
                //this._context?.Products.Remove(productToDelete);
                //this._context?.SaveChanges();

                return Ok();
            }
            catch(CommonUtils.HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch(Exception exception)
            {
                return StatusCode(500, exception.Message);
            }            
        }

        [HttpPost]
        [Route("/seller/updateproduct")]
        public async Task<IActionResult> UpdateProduct([FromForm] SellerUtils.ExtendedProduct product)
        {
            try
            {
                _ = product.IsValidOrException();
                this.CheckContext();

                string securityKeyString = this.GetSecuirtyKey();
                string? accessToken = Request.Headers["accessToken"];
                Seller sellerData = SellerUtils.StaticUtils.VerifyTokenOrException(accessToken, securityKeyString, this._context);

                if (!product.ImageIgnoreFlag) {
                    if (product.Image == null)
                        throw new CommonUtils.HttpStatusException(400, "Image Is Empty");
                    string uniqueFilename = await CommonUtils.ImageService.SaveImage(product.Image, this._environment);
                    product.Filename = uniqueFilename;
                }

                product.SellerId = sellerData.SellerId;

                _ = this._context?.Update(product);
                _ = this._context?.SaveChanges();                        

                return Ok();
            }
            catch (CommonUtils.HttpStatusException exception)
            {
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch (Exception exception)
            {
                return StatusCode(500, exception.Message);
            }
        }

        [HttpGet]
        [Route("/seller/verifytoken")]
        public IActionResult VerifyToken () 
        {
            try
            {
                this.CheckContext();
                string securityKeyString = this.GetSecuirtyKey();
                string? accessToken = Request.Headers["accessToken"];
                Seller sellerData = SellerUtils.StaticUtils.VerifyTokenOrException(accessToken, securityKeyString, this._context);        

                return Ok(sellerData.SellerName);
            }
            catch (CommonUtils.HttpStatusException exception)
            {   
                return StatusCode(exception.StatusCode, exception.Message);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }
    }
}
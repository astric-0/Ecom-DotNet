using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Server.Model;
using CommonUtils;
using DBOperations;

namespace Server.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly EcomContext? _context;
    private readonly IConfiguration _configuration;    

    public HomeController (ILogger<HomeController> logger, EcomContext context, IConfiguration configuration)
    {
        this._logger = logger;
        this._configuration = configuration;
        this._context = context;       
    }

    public void CheckContext() 
    {
        if(this._context == null)
            throw new HttpStatusException(500, "Database is not connected");        
    }

    public string GetConnectionString()
    {
        return this._configuration.GetConnectionString("EcomConnection")
        ?? throw new HttpStatusException(500, "ConnectionString not found");
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpGet]
    [Route("home/getallproducts")]
    public IActionResult GetAllProducts (/*string category, int size*/) 
    {
        try
        {
            this.CheckContext();
            return Json(this._context?.Products.ToList());
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
    [Route("home/getsellerdatabysellerid/{sellerId}")]
    public IActionResult GetSellerDataBySellerId (int sellerId)
    {
        try
        {
            if (sellerId < 0)
                throw new HttpStatusException(400, "Seller Id is invalid");

            string connectionString = this.GetConnectionString();
            return Json(HomeDBOperations.GetSellerDataBySellerId(connectionString, sellerId));
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
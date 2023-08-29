using CommonUtils;
using Microsoft.EntityFrameworkCore;
using Server.Model;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.Configure<CommonUtils.StripeOptions>(builder.Configuration.GetSection("Stripe"));
SiteEmailData emailData = new();
builder.Configuration.GetSection("SiteEmailData").Bind(emailData);
builder.Services.AddScoped<EmailService>(provider => new EmailService(emailData));

string? connectionString = builder.Configuration.GetConnectionString("EcomConnection");
if (string.IsNullOrEmpty(connectionString))
    throw new Exception("CONNECTION STRING IS NULL");
else
    builder.Services.AddDbContext<EcomContext>(options => options.UseSqlServer(connectionString));

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseCors(c => c.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(name: "default",pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
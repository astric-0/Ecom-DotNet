using Microsoft.Data.SqlClient;
using System.Data;
using CommonUtils;
using Server.Model;
using Google.Apis.Auth;
using Server.Utils;
using Stripe;

namespace DBoperations
{
    public static class UserDBOpertions
    {
        public static int IncreaseQuantityOrException(int cartId, string connectionString)
        {
            int quantity = ChangeQuantity(cartId, connectionString, "sp_increase_usercart_quantity");
            return quantity != -1 ? quantity : throw new HttpStatusException(400, "Couldn't Increase Quantity");
        }

        public static int DecreaseQuantityOrException(int cartId, string connectionString)
        { 
            int quantity = ChangeQuantity(cartId, connectionString, "sp_decrease_usercart_quantity");
            return quantity != -1 ? quantity : throw new HttpStatusException(400, "Couldn't Decrease Quantity");
        }

        private static int ChangeQuantity(int cartId, string connectionString, string procedure)
        {
            using SqlConnection connection = new(connectionString);
            using SqlCommand command = connection.CreateCommand();
            {
                connection.Open();
                command.CommandType = CommandType.StoredProcedure;
                command.CommandText = procedure;                
                command.Parameters.Add("@CartId", SqlDbType.Int).Value = cartId;
                SqlParameter returnQuantity = command.Parameters.Add("return", SqlDbType.Int);
                returnQuantity.Direction = ParameterDirection.ReturnValue;
                command.ExecuteNonQuery();
                int quantity = (int) returnQuantity.Value;

                return quantity;
            }
        }

        public static int DeleteCartProduct(int cartId, string connectionString)
        {
            using SqlConnection connection = new(connectionString);
            string commandString = $"DELETE FROM UserCart WHERE CartId={cartId}";
            using SqlCommand command = new (commandString, connection);
            {
                connection.Open();
                return command.ExecuteNonQuery();
            }
        }
    
        public static List<UserCart> GetCart(int userId, string connectionString)
        {
            using SqlConnection connection = new(connectionString);
            string commandString = $"SELECT * FROM UserCart INNER JOIN Products ON UserCart.ProductId = Products.ProductId WHERE UserCart.UserId = ${userId}";
            using SqlCommand command = new(commandString, connection);
            SqlDataReader reader = command.ExecuteReader();

            List<UserCart> UserCartProducts = new();
            while(reader.Read())
            {
                Server.Model.Product productData = new ()
                {
                    ProductId = (int) reader.GetValue(reader.GetOrdinal("ProductId")),
                    ProductName = (string) reader.GetValue(reader.GetOrdinal("ProductName")),
                    Details = (string) reader.GetValue(reader.GetOrdinal("Details")),
                    Category = (string) reader.GetValue(reader.GetOrdinal("Category")),
                    AddedOn = (DateTime) reader.GetValue(reader.GetOrdinal("AddedOn")),
                    Filename = (string) reader.GetValue(reader.GetOrdinal("Filename")),
                    Price = (int) reader.GetValue(reader.GetOrdinal("Price")),
                    Stock = (int) reader.GetValue(reader.GetOrdinal("Stock")),
                };

                UserCart cartProduct = new () 
                {
                    CartId = (int) reader.GetValue(reader.GetOrdinal("CardId")),
                    UserId = (int) reader.GetValue(reader.GetOrdinal("UserId")),
                    ProductId = (int) reader.GetValue(reader.GetOrdinal("ProductId")),
                    Quantity = (int) reader.GetValue(reader.GetOrdinal("Quantity")),  
                    Product = productData                  
                };

                UserCartProducts.Add(cartProduct);
            }
            
            return UserCartProducts;
        }        

        public static UserCart? GetCartProductById(int userId, int cartId, string connectionString)
        {
            using SqlConnection connection = new (connectionString);
            using SqlCommand command = connection.CreateCommand();

            command.CommandText = 
            @"
                SELECT * FROM UserCart uc 
                JOIN Products p ON uc.ProductId = p.ProductId 
                WHERE uc.CartId=@CartId AND uc.UserId=@UserId
            ";

            command.Parameters.AddWithValue("@CartId", cartId);
            command.Parameters.AddWithValue("@UserId", userId);
            connection.Open();
            using SqlDataReader reader = command.ExecuteReader();

            if (reader.Read())
            {
                return new ()
                {
                    CartId = cartId,
                    UserId = userId,
                    ProductId = DBReader.GetData<int>(reader, "ProductId"),
                    Quantity = DBReader.GetData<int>(reader, "Quantity"),
                    Product = new()
                    {
                        ProductId = DBReader.GetData<int>(reader, "ProductId"),
                        ProductName = DBReader.GetDataString(reader, "ProductName"),
                        SellerId = DBReader.GetData<int>(reader, "SellerId"),
                        Details = DBReader.GetDataString(reader, "Details"),
                        Category = DBReader.GetDataString(reader, "Category"),
                        AddedOn = DBReader.GetDataDTOrNull(reader, "AddedOn"),
                        ModifiedOn = DBReader.GetDataDTOrNull(reader, "ModifiedOn"),
                        Filename = DBReader.GetDataString(reader, "Filename"),
                        Price = DBReader.GetData<int>(reader, "Price"),
                        Stock = DBReader.GetData<int>(reader, "Stock")
                    }
                };
            }

            return null;
        }

        public static T? DataOrNull<T>(SqlDataReader reader, string key) 
        {
            object checkObj = reader.GetValue(reader.GetOrdinal(key));
            return (checkObj == DBNull.Value) ? default : (T) checkObj;
        }

        public static User GetUserByUserId (int userId, string connectionString)
        {
            string commandString = $"SELECT * FROM Users WHERE UserId = {userId}";
            return GetUserData(commandString, connectionString)
            ?? throw new HttpStatusException(400, "User Data not found");        
            /*using SqlConnection connection = new (connectionString);*
            
            using SqlCommand command = new (commandString, connection);
            connection.Open();
            using SqlDataReader reader = command.ExecuteReader();            

            if (reader.Read())
            {
                return new ()
                {   
                    UserId = (int) reader.GetValue(reader.GetOrdinal("UserId")),
                    Username = (string) reader.GetValue(reader.GetOrdinal("Username")),
                    Password = DataOrNull <string> (reader, "Password"),
                    FirstName = DataOrNull <string> (reader, "FirstName"),
                    LastName = DataOrNull <string> (reader, "LastName"),
                    Email = (string) reader.GetValue(reader.GetOrdinal("Email")),
                    IsVerified = (bool) reader.GetValue(reader.GetOrdinal("IsVerified")),
                    DoB = DataOrNull <DateTime> (reader, "DoB"),
                    Gender = DataOrNull <string> (reader, "Gender")                
                };
            }           
            */
            /*throw new HttpStatusException(400, "User Data not found");*/

        }

        public static User GetUserByEmail (string email, string connectionString)
        {
            string commandString = $"SELECT * FROM Users WHERE Email = {email}";
            return GetUserData(commandString, connectionString)
            ?? throw new HttpStatusException(400, "User Data not found");
        }

        private static User? GetUserData (string commandString, string connectionString)
        {
            using SqlConnection connection = new (connectionString);            
            using SqlCommand command = new (commandString, connection);
            connection.Open();
            using SqlDataReader reader = command.ExecuteReader();            

            if (reader.Read())
            {
                return new ()
                {   
                    UserId = (int) reader.GetValue(reader.GetOrdinal("UserId")),
                    Username = (string) reader.GetValue(reader.GetOrdinal("Username")),
                    Password = DataOrNull <string> (reader, "Password"),
                    FirstName = DataOrNull <string> (reader, "FirstName"),
                    LastName = DataOrNull <string> (reader, "LastName"),
                    Email = (string) reader.GetValue(reader.GetOrdinal("Email")),
                    IsVerified = (bool) reader.GetValue(reader.GetOrdinal("IsVerified")),
                    DoB = DataOrNull <DateTime> (reader, "DoB"),
                    Gender = DataOrNull <string> (reader, "Gender"),
                    AuthType = DataOrNull <string> (reader, "AuthType")
                };
            }           

            return null;
        }

        public static int RegisterGoogleUser (GoogleJsonWebSignature.Payload payload, string connectionString)
        {
            string firstname = payload.GivenName;
            string lastname = payload.FamilyName;
            string username = firstname + payload.Subject;
            string email = payload.Email;

            string procedure = "sp_check_or_register_google_user";

            using SqlConnection connection = new (connectionString);
            using SqlCommand command = connection.CreateCommand();
            connection.Open();

            command.CommandType = CommandType.StoredProcedure;
            command.CommandText = procedure;
            command.Parameters.Add("@UserName", SqlDbType.VarChar).Value = username;
            command.Parameters.Add("@FirstName", SqlDbType.VarChar).Value = firstname;
            command.Parameters.Add("@LastName", SqlDbType.VarChar).Value = lastname;
            command.Parameters.Add("@Email", SqlDbType.VarChar).Value = email;

            SqlParameter returnValue = command.Parameters.Add("return", SqlDbType.Int);
            returnValue.Direction = ParameterDirection.ReturnValue;
            command.ExecuteNonQuery();

            return (int) returnValue.Value;
        }
    
        public static int OrderSingleProduct (CartRequestBody data, string connectionString)
        {
            using SqlConnection connection = new(connectionString);
            using SqlCommand command = connection.CreateCommand();
            
            command.CommandText = "sp_order_single_product";
            command.CommandType = CommandType.StoredProcedure;
            
            command.Parameters.AddWithValue("@CartId", data.CartId);
            command.Parameters.AddWithValue("@AddressId", data.AddressId);
            command.Parameters.AddWithValue("@PaymentMethod", data.PaymentMethod);

            SqlParameter parameter = command.Parameters.Add("return", SqlDbType.Int);
            parameter.Direction = ParameterDirection.ReturnValue;

            connection.Open();
            command.ExecuteNonQuery();

            return (int) parameter.Value;
        }

        public static List<Server.Model.Address> GetUserAddresses (int userId, string connectionString)
        {            
            using SqlConnection connection = new (connectionString);
            using SqlCommand command = connection.CreateCommand();
            command.CommandText = "SELECT * FROM Addresses WHERE UserId = @UserId";
            command.Parameters.AddWithValue("@UserId", userId);
            
            connection.Open();
            using SqlDataReader reader = command.ExecuteReader();

            List<Server.Model.Address> addresses = new();
            while (reader.Read())
            {
                addresses.Add(
                    new ()
                    {
                        AddressId = DBReader.GetData<int>(reader, "AddressId"),
                        UserId = userId,
                        UserAddress = DBReader.GetDataString(reader, "UserAddress")                        
                    }
                );
            }

            return addresses;
        }

        public static List<UserOrder> GetUserOrders (int userId, string connectionString)
        {
            SqlConnection connection = new (connectionString);
            SqlCommand command = connection.CreateCommand();
            command.CommandText = 
            @"
                SELECT *, op.Id AS OrderProductId
                FROM Orders o
                JOIN OrderedProducts op ON o.OrderId = op.OrderId                               
                WHERE o.UserId = @UserId
            ";
            
            command.Parameters.AddWithValue("@UserId", userId);
            connection.Open();
            SqlDataReader reader = command.ExecuteReader();

            List<UserOrder> userOrders = new();
            int lastOrderId = -1;
            UserOrder? userOrder = null;
            while (reader.Read())
            {
                int orderId = DBReader.GetData<int> (reader, "OrderId");

                if (orderId != lastOrderId)
                {
                    if (userOrder != null)
                        userOrders.Add(userOrder);

                    userOrder = new ();
                    lastOrderId = orderId;                    
                    userOrder.Order = new ()
                    {
                        OrderId = orderId,
                        UserId = DBReader.GetData<int>(reader, "UserId"),
                        UserAddress = DBReader.GetDataString(reader, "UserAddress"),
                        OrderDate = DBReader.GetData<DateTime>(reader, "OrderDate"),
                        CompletedOn = DBReader.GetDataDTOrNull(reader, "CompletedOn"),
                        IsCancelled = DBReader.GetData<bool>(reader, "IsCancelled"),
                        PaymentMethod = DBReader.GetDataString(reader, "PaymentMethod"),
                        Amount = DBReader.GetData<double>(reader, "Amount"),                        
                    };
                }
                
                userOrder?.OrderedProducts.Add
                (
                    new ()
                    {
                        Id = DBReader.GetData<int>(reader, "OrderProductId"),
                        OrderId = orderId,                        
                        Quantity = DBReader.GetData<int>(reader, "Quantity"),
                        ProductData = DBReader.GetDataString(reader, "ProductData")                        
                    }
                );
                        
            }

            if (userOrder != null)
                userOrders.Add(userOrder);

            return userOrders;
        }
    
        
    }
}
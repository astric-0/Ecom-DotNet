using CommonUtils;
using Microsoft.Data.SqlClient;
using Server.Model;

namespace DBOperations
{
    public static class HomeDBOperations
    {
        public static Seller GetSellerDataBySellerId(string connectionString, int sellerId)
        {
            using SqlConnection connection = new (connectionString);
            string commandString = $@"SELECT SellerId, SellerName, About, Address, Email, JoinedOn, IsVerified FROM Sellers WHERE SellerId={sellerId}";
            using SqlCommand command = connection.CreateCommand();            
            connection.Open();
            command.CommandText = commandString;

            using SqlDataReader reader = command.ExecuteReader();
            if (reader.Read()) 
            {
                Seller sellerData = new()
                {
                    SellerId = (int) reader.GetValue(reader.GetOrdinal("SellerId")),
                    SellerName = (string) reader.GetValue(reader.GetOrdinal("SellerName")),
                    About = (string) reader.GetValue(reader.GetOrdinal("About")),
                    Address = (string) reader.GetValue(reader.GetOrdinal("Address")),
                    Email = (string) reader.GetValue(reader.GetOrdinal("Email")),
                    JoinedOn = (DateTime) reader.GetValue(reader.GetOrdinal("JoinedOn")),
                    IsVerified = (bool) reader.GetValue(reader.GetOrdinal("IsVerified"))
                };

                return sellerData;
            }

            throw new HttpStatusException (400, "Seller Data not found");
        }         
    }
}
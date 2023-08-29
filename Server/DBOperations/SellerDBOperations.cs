using CommonUtils;
using Microsoft.Data.SqlClient;
using Server.Model;
using Server.Utils;

namespace DBOperations;
public static class SellerDBOPerations
{
    public static Product? GetProductById (string connectionString, int productId, int sellerId)
    {

        if (productId < 0 || sellerId < 0)        
            throw new HttpStatusException(400, "Invalid Seller or Product Id");        

        using SqlConnection connection = new(connectionString);
        using SqlCommand command = connection.CreateCommand();

        command.CommandText = "SELECT * FROM Products WHERE SellerId = @SellerId AND ProductId = @ProductId";
        command.Parameters.AddWithValue("@ProductId", productId);
        command.Parameters.AddWithValue("@SellerId", sellerId);

        connection.Open();
        SqlDataReader reader = command.ExecuteReader();

        if (reader.Read())
        {
            return new ()
            {
                ProductId = productId,
                SellerId = sellerId,
                ProductName = (string) reader.GetValue(reader.GetOrdinal("ProductName")),
                Details = (string) reader.GetValue(reader.GetOrdinal("Details")),
                Category = (string) reader.GetValue(reader.GetOrdinal("Category")),
                AddedOn = (DateTime) reader.GetValue(reader.GetOrdinal("AddedOn")),
                ModifiedOn = DBReader.GetDataDTOrNull(reader, "ModifiedOn"),
                Filename = (string) reader.GetValue(reader.GetOrdinal("Filename")),                
            };
        }

        return null;
    }

    public static int DeleteProduct (string connectionString, int productId, int sellerId)
    {
        using SqlConnection connection = new (connectionString);
        using SqlCommand command = connection.CreateCommand();
        
        command.CommandText = "DELETE FROM Products WHERE ProductId = @ProductId AND SellerId = @SellerId";
        command.Parameters.AddWithValue("@ProductId", productId);
        command.Parameters.AddWithValue("@SellerId", sellerId);

        connection.Open();
        return command.ExecuteNonQuery();
    }
}
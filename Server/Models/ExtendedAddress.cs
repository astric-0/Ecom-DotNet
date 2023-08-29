using CommonUtils;
using Microsoft.Data.SqlClient;
using Server.Model;

namespace Server.Models;

public class ExtendedAddress : Address
{
    public string PhoneNumber { get; set; } = null!;
    public string HouseNumber { get; set; } = null!;
    public string Area { get; set; } = null!;
    public string LandMark { get; set; } = null!;
    public string PinCode { get; set; } = null!;
    public string Type { get; set; } = null!;
    public string State { get; set; } = null!;

    public ExtendedAddress IsValidOrException () 
    {        
        if (string.IsNullOrEmpty(this.PhoneNumber) || this.PhoneNumber.Length != 10)
            throw new HttpStatusException(400, "Phone number is invalid");
        else if (string.IsNullOrEmpty(this.HouseNumber))
            throw new HttpStatusException(400, "House number is invalid");
        else if (string.IsNullOrEmpty(this.Area))
            throw new HttpStatusException(400, "Area is invalid");        
        else if (string.IsNullOrEmpty(this.PinCode) || this.PinCode.Length > 8)
            throw new HttpStatusException(400, "PinCode is invalid");
        else if (string.IsNullOrEmpty(this.Type) || (this.Type.ToUpper() != "HOME" && this.Type.ToUpper() != "OFFICE" ))
            throw new HttpStatusException(400, "Address type is invalid");
        else if (string.IsNullOrEmpty(this.State))
            throw new HttpStatusException(400, "State is invalid");        
        
        this.Type = this.Type.ToUpper();
        return this;
    }

    public Address SaveOrException(string connectionString, int userId)
    {        
        using SqlConnection connection = new (connectionString);
        using SqlCommand command = connection.CreateCommand();        
        command.CommandText = 
        @"
            INSERT INTO Addresses (UserId, UserAddress)
            VALUES (@UserId, @UserAddress);
            SELECT SCOPE_IDENTITY();
        ";

        string userAddress = this.ToJsonString();
        command.Parameters.AddWithValue("@UserId", userId);
        command.Parameters.AddWithValue("@UserAddress", userAddress);
        
        connection.Open();
        int addressId = Convert.ToInt32(command.ExecuteScalar());

        return new Address {
            AddressId = addressId,
            UserId = userId,
            UserAddress = userAddress
        };
    }

    public string ToJsonString ()
    {
        return Newtonsoft.Json.JsonConvert.SerializeObject(this);
    }

    public static int DeleteAddress(string connectionString, int userId, int addressId)
    {
        using SqlConnection connection = new (connectionString);
        using SqlCommand command = connection.CreateCommand();
        
        command.CommandText = @"
            DELETE FROM Addresses WHERE UserId = @UserId AND AddressId = @AddressId
        ";
        command.Parameters.AddWithValue("@UserId", userId);
        command.Parameters.AddWithValue("@AddressId", addressId); 
        connection.Open();
        return command.ExecuteNonQuery();
    }
}
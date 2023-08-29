using System.Data;
using Microsoft.Data.SqlClient;

namespace Server.Utils;

public static class DBReader
{
    public static T? GetDataOrDefault <T> (SqlDataReader reader, string fieldName)
    {
        object fieldObj = reader.GetValue(reader.GetOrdinal(fieldName));
        if (fieldObj == DBNull.Value || fieldObj == null)        
            return default;
        return (T) fieldObj;
    }

    public static string GetDataString (SqlDataReader reader, string fieldName)
    {
        return (string) reader.GetValue(reader.GetOrdinal(fieldName));
    }

    public static T GetData <T> (SqlDataReader reader, string fieldName)
    {
        return (T) reader.GetValue(reader.GetOrdinal(fieldName));
    }

    public static DateTime? GetDataDTOrNull (SqlDataReader reader, string fieldName)
    {
        object fieldObj =  reader.GetValue(reader.GetOrdinal(fieldName));
        if (fieldObj == DBNull.Value || fieldObj == null)
            return null;
        return (DateTime) fieldObj;
    }        
}
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Seller
    {                
        [Key]
        public int SellerId { get; set; }
        public string? Sellername { get; set; }
        public string? Password { get; set; }
        public string? About { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
    }
}
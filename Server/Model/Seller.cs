using System;
using System.Collections.Generic;

namespace Server.Model;

public partial class Seller
{
    public int SellerId { get; set; }

    public string SellerName { get; set; } = null!;

    public string About { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Email { get; set; } = null!;

    public DateTime? JoinedOn { get; set; }

    public bool? IsVerified { get; set; }

    public string? Password { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}

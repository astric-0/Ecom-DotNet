using System;
using System.Collections.Generic;

namespace Server.Model;

public partial class Product
{
    public int ProductId { get; set; }

    public int SellerId { get; set; }

    public string Details { get; set; } = null!;

    public string? Category { get; set; }

    public DateTime? AddedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public string? Filename { get; set; }

    public int Price { get; set; }

    public int Stock { get; set; }

    public string ProductName { get; set; } = null!;

    public virtual Seller Seller { get; set; } = null!;

    public virtual ICollection<UserCart> UserCarts { get; set; } = new List<UserCart>();
}

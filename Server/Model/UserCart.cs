using System;
using System.Collections.Generic;

namespace Server.Model;

public partial class UserCart
{
    public int CartId { get; set; }

    public int UserId { get; set; }

    public int? ProductId { get; set; }

    public int? Quantity { get; set; }

    public virtual Product? Product { get; set; }

    public virtual User User { get; set; } = null!;
}

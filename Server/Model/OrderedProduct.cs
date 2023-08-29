using System;
using System.Collections.Generic;

namespace Server.Model;

public partial class OrderedProduct
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int Quantity { get; set; }

    public string ProductData { get; set; } = null!;

    public virtual Order Order { get; set; } = null!;
}

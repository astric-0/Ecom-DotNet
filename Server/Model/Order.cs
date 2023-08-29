using System;
using System.Collections.Generic;

namespace Server.Model;

public partial class Order
{
    public int OrderId { get; set; }

    public int UserId { get; set; }

    public DateTime? OrderDate { get; set; }

    public DateTime? CompletedOn { get; set; }

    public bool? IsCancelled { get; set; }

    public string? PaymentMethod { get; set; }

    public double Amount { get; set; }

    public string? UserAddress { get; set; }

    public virtual User User { get; set; } = null!;
}

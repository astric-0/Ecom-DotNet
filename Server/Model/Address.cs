using System;
using System.Collections.Generic;

namespace Server.Model;

public partial class Address
{
    public int AddressId { get; set; }

    public int UserId { get; set; }

    public string UserAddress { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}

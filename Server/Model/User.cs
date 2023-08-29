using System;
using System.Collections.Generic;

namespace Server.Model;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public bool? IsVerified { get; set; }

    public DateTime? DoB { get; set; }

    public string? Gender { get; set; }

    public string? Password { get; set; }

    public string Email { get; set; } = null!;

    public string? LastName { get; set; }

    public string? FirstName { get; set; }

    public string? AuthType { get; set; }

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<UserCart> UserCarts { get; set; } = new List<UserCart>();
}

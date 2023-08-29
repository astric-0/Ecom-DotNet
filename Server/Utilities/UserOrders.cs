using Server.Model;

namespace CommonUtils;
public class UserOrder
{
    public Order Order { get; set; } = null!;
    public List<OrderedProduct> OrderedProducts { get; set; } = new();
}
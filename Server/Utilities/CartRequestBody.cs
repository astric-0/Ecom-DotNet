namespace CommonUtils;

public class CartRequestBody
{
    public int CartId { get; set; }
    public int AddressId { get; set; }
    public string PaymentMethod { get; set; } = null!;

    public void IsValidOrException ()
    {
        if (CartId < 0)
            throw new HttpStatusException(400, "Invalid Cart Id");
        else if (AddressId < 0)
            throw new HttpStatusException(400, "Invalid Product Id");
        else if (string.IsNullOrEmpty(PaymentMethod))
            throw new HttpStatusException(400, "Payment Method Is Undefined");
        else if (PaymentMethod != "UPI" && PaymentMethod !="COD")
            throw new HttpStatusException(400, "Payment Method Is Invalid");
    }
}
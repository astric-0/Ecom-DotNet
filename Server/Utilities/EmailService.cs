using System.Net.Mail;
using System.Net;

namespace CommonUtils;
public class EmailService
{
    private string Sender { get; set; } = null!;
    private string AppPassword { get; set; } = null!;

    public EmailService(SiteEmailData data)
    {
        this.Sender = data.SiteEmail;
        this.AppPassword = data.AppPassword;
    }

    public bool SendEmail (string receiver, string subject, string htmlBody)
    {
        try
        {
            MailMessage mailMessage = new() 
            {         
                From = new MailAddress(this.Sender),
                Subject = subject,
                IsBodyHtml = true,
                Body = htmlBody
            };

            mailMessage.To.Add(receiver);

            SmtpClient smtpClient = new()
            {
                Host = "smtp.gmail.com",
                Port = 587,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(this.Sender, this.AppPassword),
                EnableSsl = true    
            };

            smtpClient.Send(mailMessage);
            return true;
        }

        catch(Exception exception)
        {
            Console.WriteLine(exception.Message);
            return false;
        }
    }
}
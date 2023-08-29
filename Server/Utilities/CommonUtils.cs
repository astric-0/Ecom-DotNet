namespace CommonUtils
{
    public class HttpStatusException : Exception
    {
        public int StatusCode { get; set; }
        public HttpStatusException(int StatusCode, string Message) : base (Message)
        {
            this.StatusCode = StatusCode;
        }        
    }

    public static class ImageService
    {
        public static async Task<string> SaveImage (IFormFile Image, IWebHostEnvironment environment)
        {
            string uniqueFilename = Guid.NewGuid().ToString() + "_" + Image.FileName;
            string imagePath = Path.Combine(environment.WebRootPath, "images");

            if(!Directory.Exists(imagePath))
                Directory.CreateDirectory(imagePath);

            string filePath = Path.Combine(imagePath, uniqueFilename);
            using Stream stream = new FileStream(filePath, FileMode.Create);
            await Image.CopyToAsync(stream);

            return uniqueFilename;
        }

        public static void DeleteImage (IWebHostEnvironment environment, string imageName)
        {
            string imagePath = Path.Combine(environment.WebRootPath, "images");

            if (Directory.Exists(imagePath))
                File.Delete(imagePath + "/" + imageName);
            else
                throw new Exception("Couldn't Delete Image: " + imageName);                    
        }
    }
}
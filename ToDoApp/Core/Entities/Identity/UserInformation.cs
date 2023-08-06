namespace Core.Entities.Identity
{
    public class UserInformation
    {
        public int Id { get; set; }
        
        public string FirstName { get; set; }
        
        public string LastName { get; set; }

        public byte[] ProfilePicture { get; set; }

        public int UserId { get; set; }
        
        public User User { get; set; }
    }
}
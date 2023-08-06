using System.Text.Json;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Infrastructure.DAL.SeedData
{
    public class ApplicationDbContextSeed
    {
        public static async Task SeedAsync(ApplicationDbContext context, ILoggerFactory factory)
        {
            try
            {
                if (!context.ProductCategories.Any())
                {
                    var categories = await File.ReadAllTextAsync("../Infrastructure/DAL/SeedData/categories-seed-data.json");
                    var deserializedCategories = JsonSerializer.Deserialize<List<ProductCategory>>(categories);

                    foreach (var item in deserializedCategories)
                    {
                        context.ProductCategories.Add(item);
                    }

                    await context.SaveChangesAsync();
                }

                if (!context.Products.Any())
                {
                    var products = await File.ReadAllTextAsync("../Infrastructure/DAL/SeedData/fruits-seed-data.json");
                    var deserializedProducts = JsonSerializer.Deserialize<List<Product>>(products);

                    foreach (var item in deserializedProducts)
                    {
                        context.Products.Add(item);
                    }

                    await context.SaveChangesAsync();
                }

                 if (!context.DeliveryMethods.Any())
                {
                    var dmData = await File.ReadAllTextAsync("../Infrastructure/DAL/SeedData/delivery.json");
                    var methods = JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData);

                    foreach (var item in methods)
                    {
                        context.DeliveryMethods.Add(item);
                    }

                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                var logger = factory.CreateLogger<ApplicationDbContextSeed>();
                logger.LogError(ex.Message);
            }
        }

        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user  = new AppUser {
                    DisplayName = "Bob",
                    Email = "bob@test.com",
                    UserName = "bob@test.com",
                    Address = new Core.Entities.Identity.Address {
                        FirstName = "Bob",
                        LastName = "Joe",
                        Street = "10 The Street",
                        City = "New York",
                        ZipCode = "90210"
                    }
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }

    }
}
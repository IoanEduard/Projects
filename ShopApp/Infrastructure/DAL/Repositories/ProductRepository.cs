using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DAL.Repositories;
public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext context;

    public ProductRepository(ApplicationDbContext context) {
        this.context = context;
    }

    public async Task<Product> GetProductByIdAsync(int id)
    {
        return await context.Products.FindAsync(id);
    }

    public async Task<IReadOnlyList<ProductCategory>> GetProductCategoryAsync()
    {
        return await context.ProductCategories.ToListAsync();
    }

    public async Task<IReadOnlyList<Product>> GetProductsAsync()
    {
        return await context.Products.Include(c => c.ProductCategory).ToListAsync();
    }
}

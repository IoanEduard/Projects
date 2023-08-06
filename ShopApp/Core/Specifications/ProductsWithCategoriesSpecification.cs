using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithCategoriesSpecification : BaseSpecification<Product>
    {
        public ProductsWithCategoriesSpecification(ProductSpecificationParams specParams)
            : base(x => 
            (string.IsNullOrEmpty(specParams.Search) || x.Name.ToLower().Contains(specParams.Search)) &&
            (!specParams.CategoryId.HasValue || x.ProductCategoryId == specParams.CategoryId)
            )
        {
            AddInclude(x => x.ProductCategory);
            AddOrderBy(x => x.Name);
            ApplyPagging(specParams.PageSize * (specParams.PageIndex - 1), specParams.PageSize);

            if (!string.IsNullOrEmpty(specParams.Sort))
            {
                switch (specParams.Sort)
                {
                    case "priceAsc":
                        AddOrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDesc(p => p.Price);
                        break;
                    default:
                        AddOrderBy(n => n.Name);
                        break;
                }
            }
        }

        public ProductsWithCategoriesSpecification(int id)
        : base(x => x.Id == id)
        {
            AddInclude(x => x.ProductCategory);
        }
    }
} 
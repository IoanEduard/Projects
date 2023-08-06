using Core.Entities;

namespace Core.Specifications
{
    public class ProductWithFiltersForCountSpecification : BaseSpecification<Product>
    {
        public ProductWithFiltersForCountSpecification(ProductSpecificationParams specParams)
            : base(x => 
            (string.IsNullOrEmpty(specParams.Search) || x.Name.ToLower().Contains(specParams.Search)) &&
            (!specParams.CategoryId.HasValue || x.ProductCategoryId == specParams.CategoryId))
        {

        }
    }
}
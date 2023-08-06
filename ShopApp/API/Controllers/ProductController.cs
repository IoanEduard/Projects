using API.DTO;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProductController : BaseApiController
{
    private readonly IGenericRepository<Product> _productsRepo;
    private readonly IGenericRepository<ProductCategory> _productCategoryRepo;
    private readonly IMapper _mapper;

    public ProductController(IGenericRepository<Product> productsRepo, IGenericRepository<ProductCategory> productCategoryRepo, IMapper mapper)
    {
        _productsRepo = productsRepo;
        _productCategoryRepo = productCategoryRepo;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<Pagination<Product>>> GetProducts(
        [FromQuery]ProductSpecificationParams specParams)
    {
        var spec = new ProductsWithCategoriesSpecification(specParams);

        var countSpec = new ProductWithFiltersForCountSpecification(specParams);

        var totalItems = await _productsRepo.CountAsync(countSpec);

        var products = await _productsRepo.ListAsync(spec);

        var data = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductDto>>(products);

        return Ok(new Pagination<ProductDto>(specParams.PageIndex, specParams.PageSize, totalItems, data));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Product>> GetProductById(int id)
    {
        var spec = new ProductsWithCategoriesSpecification(id);

        var product = await _productsRepo.GetEntityWithSpec(spec);

        if (product == null) return NotFound(new ApiResponse(404));

        return Ok(_mapper.Map<Product, ProductDto>(product));
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<ProductCategory>>> GetProductCategories()
    {
        var categories = await _productCategoryRepo.ListAllAsync();

        return Ok(categories);
    }
}
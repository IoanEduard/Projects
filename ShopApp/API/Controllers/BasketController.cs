using API.DTO;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

public class BasketController : BaseApiController
{
    private readonly IBasketRespository _basketRepository;
    private readonly IMapper _mapper;

    public BasketController(IBasketRespository basketRepository, IMapper mapper)
    {
        _basketRepository = basketRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<CustomerBasket>> GetBasketById(Guid id)
    {
        var basket = await _basketRepository.GetBasketAsync(id);

        return Ok(basket);
    }

    [HttpPost]
    public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketDto basket)
    {
        var customerBasket = _mapper.Map<CustomerBasketDto, CustomerBasket>(basket);

        var updatedBasket = await _basketRepository.UpdateBasketAsync(customerBasket);

        return Ok(updatedBasket);
    }

    [HttpPost("setShippingPrice")]
    public async Task<ActionResult<CustomerBasket>> SetShippingPrice(CustomerBasketDto basket)
    {
        var customerBasket = _mapper.Map<CustomerBasketDto, CustomerBasket>(basket);

        var updatedBasket = await _basketRepository.SetShippingPrice(customerBasket);

        return Ok(_mapper.Map<CustomerBasket, CustomerBasketDto>(updatedBasket));
    }

    [HttpPost("createEmptyBasket")]
    public async Task<ActionResult<Guid>> CreateEmptyBasket(NewBasketDto newBasketDto)
    {
        var customerBasket = await _basketRepository.CreateNewEmptyBasket(newBasketDto.ProductId, newBasketDto.Quantity);

        return (customerBasket.Id == null || customerBasket.Id == Guid.Empty)
            ? BadRequest("Failed to create empty cart")
            : Ok(customerBasket);
    }

    // could improve this with a switch and an enum
    [HttpPost("incrementQuantity/{productId}")]
    public async Task<ActionResult<BasketItem>> IncrementQuantity(int productId)
    {
        var basketItem = await _basketRepository.IncrementQuantity(productId);

        return basketItem;
    }

    [HttpPost("decrementQuantity/{productId}")]
    public async Task<ActionResult<BasketItem>> DecrementQuantity(int productId)
    {
        
        var basketItem = await _basketRepository.DecrementQuantity(productId);

        if(basketItem == null) return BadRequest("Can't decrement from 1");

        return basketItem;
    }

    [HttpDelete("deleteBasket/{id}")]
    public async Task DeleteBasketAsync(Guid id)
    {
        await _basketRepository.DeleteBasketAsync(id);
    }

    [HttpDelete("removeItemFromBasket/{productId}")]
    public async Task<bool> DeleteBasketItemAsync(int productId)
    {
        return await _basketRepository.DeleteBasketItemAsync(productId);
    }
}
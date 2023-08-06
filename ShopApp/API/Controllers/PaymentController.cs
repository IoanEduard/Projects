using System;
using API.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace API.Controllers
{
    public class PaymentController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<IPaymentService> _logger;
        private const string WhSecret = "whsec_8307ed718c623b1dd3a4f2fe5a02e0f59c111124315016f5193928cc569a97cb";

        public PaymentController(IPaymentService paymentService, ILogger<IPaymentService> logger)
        {
            this._paymentService = paymentService;
            this._logger = logger;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(Guid basketId)
        {
            var basket = await _paymentService.CreateOrUpdateIntent(basketId);

            if (basket == null) return BadRequest(new ApiResponse(400, "Problems"));

            return basket;
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebHook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], WhSecret);

            PaymentIntent intent;
            Core.Entities.OrderAggregate.Order order;

            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Succeeded ", intent.Id);
                     order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                     _logger.LogInformation("Order updated to payment received ", order.Id);
                    break;
                case "payment_intent.payment_failed":
                    intent = (PaymentIntent)stripeEvent.Data.Object;
                    _logger.LogInformation("Payment failed ", intent.Id);
                       order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                     _logger.LogInformation("Payment failed ", order.Id);
                    break;
            }

            return new EmptyResult();
        }
    }
}

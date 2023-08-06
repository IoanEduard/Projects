using System;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.DAL.Config
{
    public class CustomerBasketConfiguration : IEntityTypeConfiguration<CustomerBasket>
    {
        public void Configure(EntityTypeBuilder<CustomerBasket> builder)
        {
            builder.HasKey(k => k.Id);
            builder.Property(k => k.Id)
                .ValueGeneratedNever();
        }
    }
}

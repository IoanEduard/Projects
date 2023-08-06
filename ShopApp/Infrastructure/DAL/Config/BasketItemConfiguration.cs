using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.DAL.Config
{
    public class BasketItemConfiguration : IEntityTypeConfiguration<BasketItem>
    {
        public void Configure(EntityTypeBuilder<BasketItem> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).ValueGeneratedOnAdd();
            
            builder.HasOne(p => p.CustomerBasket).WithMany()
                .HasForeignKey(p => p.CustomberBasketId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
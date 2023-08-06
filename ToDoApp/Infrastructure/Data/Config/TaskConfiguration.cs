using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class TaskConfiguration : IEntityTypeConfiguration<Core.Entities.Task>
    {
        public void Configure(EntityTypeBuilder<Core.Entities.Task> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Project)
                .WithMany(x => x.Tasks)
                .HasForeignKey(x => x.ProjectId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasMany(x => x.Comments)
                .WithOne(x => x.Task)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
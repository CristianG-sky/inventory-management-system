using Microsoft.EntityFrameworkCore;
using ProductService.Api.Models;

namespace ProductService.Api.Data
{
    public class ProductDbContext : DbContext
    {
        public ProductDbContext(DbContextOptions<ProductDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar la tabla Products
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("products");
                
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").HasColumnType("uuid");
                
                entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.Category).HasColumnName("category").HasMaxLength(100).IsRequired();
                entity.Property(e => e.ImageUrl).HasColumnName("imageurl").HasMaxLength(500);
                entity.Property(e => e.Price).HasColumnName("price").HasColumnType("decimal(10,2)").IsRequired();
                entity.Property(e => e.Stock).HasColumnName("stock").IsRequired();
                entity.Property(e => e.CreatedAt).HasColumnName("createdat").HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasColumnName("updatedat").HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.IsActive).HasColumnName("isactive").HasDefaultValue(true);

                // Índices
                entity.HasIndex(e => e.Name).HasDatabaseName("idx_products_name");
                entity.HasIndex(e => e.Category).HasDatabaseName("idx_products_category");
                entity.HasIndex(e => e.IsActive).HasDatabaseName("idx_products_active");
            });
        }
    }
}

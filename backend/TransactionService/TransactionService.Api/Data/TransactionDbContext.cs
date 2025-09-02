using Microsoft.EntityFrameworkCore;
using TransactionService.Api.Models;

namespace TransactionService.Api.Data
{
    public class TransactionDbContext : DbContext
    {
        public TransactionDbContext(DbContextOptions<TransactionDbContext> options) : base(options)
        {
        }

        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar la tabla Transactions
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.ToTable("transactions");
                
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id").HasColumnType("uuid");
                
                entity.Property(e => e.ProductId).HasColumnName("productid").HasColumnType("uuid").IsRequired();
                entity.Property(e => e.TransactionDate).HasColumnName("transactiondate").HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.TransactionType).HasColumnName("transactiontype").HasMaxLength(20).IsRequired();
                entity.Property(e => e.Quantity).HasColumnName("quantity").IsRequired();
                entity.Property(e => e.UnitPrice).HasColumnName("unitprice").HasColumnType("decimal(10,2)").IsRequired();
                entity.Property(e => e.TotalPrice).HasColumnName("totalprice").HasColumnType("decimal(10,2)").IsRequired();
                entity.Property(e => e.Details).HasColumnName("details");
                entity.Property(e => e.CreatedAt).HasColumnName("createdat").HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Índices
                entity.HasIndex(e => e.ProductId).HasDatabaseName("idx_transactions_product_id");
                entity.HasIndex(e => e.TransactionDate).HasDatabaseName("idx_transactions_date");
                entity.HasIndex(e => e.TransactionType).HasDatabaseName("idx_transactions_type");
                entity.HasIndex(e => new { e.ProductId, e.TransactionDate }).HasDatabaseName("idx_transactions_product_date");
            });
        }
    }
}

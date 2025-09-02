using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransactionService.Api.Models
{
    public class Transaction
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        public Guid ProductId { get; set; }
        
        [Required]
        public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
        
        [Required]
        [StringLength(20)]
        public string TransactionType { get; set; } = string.Empty; // "Purchase" or "Sale"
        
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public int Quantity { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        [Range(0, double.MaxValue, ErrorMessage = "UnitPrice must be greater than or equal to 0")]
        public decimal UnitPrice { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        [Range(0, double.MaxValue, ErrorMessage = "TotalPrice must be greater than or equal to 0")]
        public decimal TotalPrice { get; set; }
        
        public string? Details { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

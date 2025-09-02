using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductService.Api.Models
{
    public class Product
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? ImageUrl { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be greater than or equal to 0")]
        public decimal Price { get; set; }
        
        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock must be greater than or equal to 0")]
        public int Stock { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        [Required]
        public bool IsActive { get; set; } = true;
    }
}

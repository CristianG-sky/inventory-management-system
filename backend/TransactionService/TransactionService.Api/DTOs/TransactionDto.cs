using System.ComponentModel.DataAnnotations;

namespace TransactionService.Api.DTOs
{
    public class TransactionDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public DateTime TransactionDate { get; set; }
        public string TransactionType { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Details { get; set; }
        public DateTime CreatedAt { get; set; }
        
        // Información del producto (viene del ProductService)
        public string ProductName { get; set; } = string.Empty;
        public string ProductCategory { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
    }

    public class CreateTransactionDto
    {
        [Required(ErrorMessage = "ProductId is required")]
        public Guid ProductId { get; set; }
        
        public DateTime? TransactionDate { get; set; }
        
        [Required(ErrorMessage = "TransactionType is required")]
        [RegularExpression("^(Purchase|Sale)$", ErrorMessage = "TransactionType must be either 'Purchase' or 'Sale'")]
        public string TransactionType { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public int Quantity { get; set; }
        
        [Required(ErrorMessage = "UnitPrice is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "UnitPrice must be greater than 0")]
        public decimal UnitPrice { get; set; }
        
        [StringLength(1000, ErrorMessage = "Details cannot exceed 1000 characters")]
        public string? Details { get; set; }
    }

    public class UpdateTransactionDto
    {
        public DateTime? TransactionDate { get; set; }
        
        [Required(ErrorMessage = "TransactionType is required")]
        [RegularExpression("^(Purchase|Sale)$", ErrorMessage = "TransactionType must be either 'Purchase' or 'Sale'")]
        public string TransactionType { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public int Quantity { get; set; }
        
        [Required(ErrorMessage = "UnitPrice is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "UnitPrice must be greater than 0")]
        public decimal UnitPrice { get; set; }
        
        [StringLength(1000, ErrorMessage = "Details cannot exceed 1000 characters")]
        public string? Details { get; set; }
    }

    public class TransactionFilterDto
    {
        public Guid? ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? TransactionType { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? MinAmount { get; set; }
        public decimal? MaxAmount { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "TransactionDate";
        public bool SortDescending { get; set; } = true;
    }

    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalItems { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }

    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }

    // DTO para comunicación entre microservicios
    public class ProductDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsActive { get; set; }
    }

    public class ProductApiResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public ProductDto? Data { get; set; }
    }

    public class StockUpdateRequest
    {
        public int Quantity { get; set; }
        public bool IsIncrease { get; set; }
    }
}
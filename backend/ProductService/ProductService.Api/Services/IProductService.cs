using ProductService.Api.DTOs;

namespace ProductService.Api.Services
{
    public interface IProductService
    {
        Task<ApiResponse<PagedResult<ProductDto>>> GetProductsAsync(ProductFilterDto filter);
        Task<ApiResponse<ProductDto>> GetProductByIdAsync(Guid id);
        Task<ApiResponse<ProductDto>> CreateProductAsync(CreateProductDto createProductDto);
        Task<ApiResponse<ProductDto>> UpdateProductAsync(Guid id, UpdateProductDto updateProductDto);
        Task<ApiResponse<bool>> DeleteProductAsync(Guid id);
        Task<ApiResponse<bool>> UpdateStockAsync(Guid productId, int quantity, bool isIncrease);
        Task<ApiResponse<bool>> CheckStockAvailabilityAsync(Guid productId, int requiredQuantity);
    }
}

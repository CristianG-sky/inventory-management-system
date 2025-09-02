using TransactionService.Api.DTOs;

namespace TransactionService.Api.Services
{
    public interface IProductService
    {
        Task<ProductApiResponse> GetProductByIdAsync(Guid productId);
        Task<ApiResponse<bool>> UpdateStockAsync(Guid productId, int quantity, bool isIncrease);
        Task<ApiResponse<bool>> CheckStockAvailabilityAsync(Guid productId, int requiredQuantity);
    }
}

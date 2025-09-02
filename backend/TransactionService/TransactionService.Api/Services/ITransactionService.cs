using TransactionService.Api.DTOs;

namespace TransactionService.Api.Services
{
    public interface ITransactionService
    {
        Task<ApiResponse<PagedResult<TransactionDto>>> GetTransactionsAsync(TransactionFilterDto filter);
        Task<ApiResponse<TransactionDto>> GetTransactionByIdAsync(Guid id);
        Task<ApiResponse<TransactionDto>> CreateTransactionAsync(CreateTransactionDto createTransactionDto);
        Task<ApiResponse<TransactionDto>> UpdateTransactionAsync(Guid id, UpdateTransactionDto updateTransactionDto);
        Task<ApiResponse<bool>> DeleteTransactionAsync(Guid id);
        Task<ApiResponse<List<TransactionDto>>> GetProductHistoryAsync(Guid productId);
    }
}
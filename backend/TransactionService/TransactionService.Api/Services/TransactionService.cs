using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TransactionService.Api.Data;
using TransactionService.Api.DTOs;
using TransactionService.Api.Models;

namespace TransactionService.Api.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly TransactionDbContext _context;
        private readonly IProductService _productService;
        private readonly IMapper _mapper;
        private readonly ILogger<TransactionService> _logger;

        public TransactionService(
            TransactionDbContext context,
            IProductService productService,
            IMapper mapper,
            ILogger<TransactionService> logger)
        {
            _context = context;
            _productService = productService;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ApiResponse<PagedResult<TransactionDto>>> GetTransactionsAsync(TransactionFilterDto filter)
        {
            try
            {
                var query = _context.Transactions.AsQueryable();

                // Aplicar filtros
                if (filter.ProductId.HasValue)
                {
                    query = query.Where(t => t.ProductId == filter.ProductId.Value);
                }

                if (!string.IsNullOrEmpty(filter.TransactionType))
                {
                    query = query.Where(t => t.TransactionType.ToLower() == filter.TransactionType.ToLower());
                }

                if (filter.StartDate.HasValue)
                {
                    query = query.Where(t => t.TransactionDate >= filter.StartDate.Value);
                }

                if (filter.EndDate.HasValue)
                {
                    query = query.Where(t => t.TransactionDate <= filter.EndDate.Value);
                }

                if (filter.MinAmount.HasValue)
                {
                    query = query.Where(t => t.TotalPrice >= filter.MinAmount.Value);
                }

                if (filter.MaxAmount.HasValue)
                {
                    query = query.Where(t => t.TotalPrice <= filter.MaxAmount.Value);
                }

                // Aplicar ordenamiento
                query = filter.SortBy.ToLower() switch
                {
                    "transactiondate" => filter.SortDescending ? 
                        query.OrderByDescending(t => t.TransactionDate) : 
                        query.OrderBy(t => t.TransactionDate),
                    "transactiontype" => filter.SortDescending ? 
                        query.OrderByDescending(t => t.TransactionType) : 
                        query.OrderBy(t => t.TransactionType),
                    "quantity" => filter.SortDescending ? 
                        query.OrderByDescending(t => t.Quantity) : 
                        query.OrderBy(t => t.Quantity),
                    "totalprice" => filter.SortDescending ? 
                        query.OrderByDescending(t => t.TotalPrice) : 
                        query.OrderBy(t => t.TotalPrice),
                    _ => query.OrderByDescending(t => t.TransactionDate)
                };

                // Obtener total de elementos
                var totalItems = await query.CountAsync();

                // Aplicar paginación
                var transactions = await query
                    .Skip((filter.Page - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .ToListAsync();

                // Mapear a DTOs y obtener información de productos
                var transactionDtos = new List<TransactionDto>();
                
                foreach (var transaction in transactions)
                {
                    var dto = _mapper.Map<TransactionDto>(transaction);
                    
                    // Obtener información del producto
                    var productResponse = await _productService.GetProductByIdAsync(transaction.ProductId);
                    if (productResponse.Success && productResponse.Data != null)
                    {
                        dto.ProductName = productResponse.Data.Name;
                        dto.ProductCategory = productResponse.Data.Category;
                        dto.CurrentStock = productResponse.Data.Stock;
                    }
                    
                    transactionDtos.Add(dto);
                }

                var pagedResult = new PagedResult<TransactionDto>
                {
                    Items = transactionDtos,
                    TotalItems = totalItems,
                    CurrentPage = filter.Page,
                    PageSize = filter.PageSize,
                    TotalPages = (int)Math.Ceiling(totalItems / (double)filter.PageSize),
                    HasNextPage = filter.Page < Math.Ceiling(totalItems / (double)filter.PageSize),
                    HasPreviousPage = filter.Page > 1
                };

                return new ApiResponse<PagedResult<TransactionDto>>
                {
                    Success = true,
                    Message = "Transactions retrieved successfully",
                    Data = pagedResult
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions");
                return new ApiResponse<PagedResult<TransactionDto>>
                {
                    Success = false,
                    Message = "Error retrieving transactions",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse<TransactionDto>> GetTransactionByIdAsync(Guid id)
        {
            try
            {
                var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id);
                
                if (transaction == null)
                {
                    return new ApiResponse<TransactionDto>
                    {
                        Success = false,
                        Message = "Transaction not found"
                    };
                }

                var dto = _mapper.Map<TransactionDto>(transaction);
                
                // Obtener información del producto
                var productResponse = await _productService.GetProductByIdAsync(transaction.ProductId);
                if (productResponse.Success && productResponse.Data != null)
                {
                    dto.ProductName = productResponse.Data.Name;
                    dto.ProductCategory = productResponse.Data.Category;
                    dto.CurrentStock = productResponse.Data.Stock;
                }

                return new ApiResponse<TransactionDto>
                {
                    Success = true,
                    Message = "Transaction retrieved successfully",
                    Data = dto
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transaction with id {TransactionId}", id);
                return new ApiResponse<TransactionDto>
                {
                    Success = false,
                    Message = "Error retrieving transaction",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse<TransactionDto>> CreateTransactionAsync(CreateTransactionDto createTransactionDto)
        {
            try
            {
                // Validar que el producto existe
                var productResponse = await _productService.GetProductByIdAsync(createTransactionDto.ProductId);
                if (!productResponse.Success || productResponse.Data == null)
                {
                    return new ApiResponse<TransactionDto>
                    {
                        Success = false,
                        Message = "Product not found"
                    };
                }

                // Validar stock para ventas
                if (createTransactionDto.TransactionType.ToLower() == "sale")
                {
                    var stockCheck = await _productService.CheckStockAvailabilityAsync(
                        createTransactionDto.ProductId, 
                        createTransactionDto.Quantity);
                    
                    if (!stockCheck.Success || !stockCheck.Data)
                    {
                        return new ApiResponse<TransactionDto>
                        {
                            Success = false,
                            Message = stockCheck.Message ?? "Insufficient stock for sale"
                        };
                    }
                }

                // Crear la transacción
                var transaction = _mapper.Map<Transaction>(createTransactionDto);
                transaction.Id = Guid.NewGuid();
                transaction.TransactionDate = createTransactionDto.TransactionDate ?? DateTime.UtcNow;
                transaction.TotalPrice = createTransactionDto.UnitPrice * createTransactionDto.Quantity;
                transaction.CreatedAt = DateTime.UtcNow;

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                // Actualizar stock del producto
                bool isIncrease = createTransactionDto.TransactionType.ToLower() == "purchase";
                var stockUpdateResult = await _productService.UpdateStockAsync(
                    createTransactionDto.ProductId,
                    createTransactionDto.Quantity,
                    isIncrease);

                if (!stockUpdateResult.Success)
                {
                    // Revertir la transacción si no se pudo actualizar el stock
                    _context.Transactions.Remove(transaction);
                    await _context.SaveChangesAsync();
                    
                    return new ApiResponse<TransactionDto>
                    {
                        Success = false,
                        Message = "Failed to update product stock"
                    };
                }

                // Crear el DTO de respuesta
                var dto = _mapper.Map<TransactionDto>(transaction);
                dto.ProductName = productResponse.Data.Name;
                dto.ProductCategory = productResponse.Data.Category;
                dto.CurrentStock = productResponse.Data.Stock + (isIncrease ? createTransactionDto.Quantity : -createTransactionDto.Quantity);

                return new ApiResponse<TransactionDto>
                {
                    Success = true,
                    Message = "Transaction created successfully",
                    Data = dto
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating transaction");
                return new ApiResponse<TransactionDto>
                {
                    Success = false,
                    Message = "Error creating transaction",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse<TransactionDto>> UpdateTransactionAsync(Guid id, UpdateTransactionDto updateTransactionDto)
        {
            try
            {
                var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id);
                
                if (transaction == null)
                {
                    return new ApiResponse<TransactionDto>
                    {
                        Success = false,
                        Message = "Transaction not found"
                    };
                }

                // Revertir el stock de la transacción original
                bool wasIncrease = transaction.TransactionType.ToLower() == "purchase";
                await _productService.UpdateStockAsync(transaction.ProductId, transaction.Quantity, !wasIncrease);

                // Validar stock para la nueva transacción si es venta
                if (updateTransactionDto.TransactionType.ToLower() == "sale")
                {
                    var stockCheck = await _productService.CheckStockAvailabilityAsync(
                        transaction.ProductId, 
                        updateTransactionDto.Quantity);
                    
                    if (!stockCheck.Success || !stockCheck.Data)
                    {
                        // Restaurar el stock original
                        await _productService.UpdateStockAsync(transaction.ProductId, transaction.Quantity, wasIncrease);
                        
                        return new ApiResponse<TransactionDto>
                        {
                            Success = false,
                            Message = stockCheck.Message ?? "Insufficient stock for sale"
                        };
                    }
                }

                // Actualizar la transacción
                _mapper.Map(updateTransactionDto, transaction);
                transaction.TotalPrice = updateTransactionDto.UnitPrice * updateTransactionDto.Quantity;
                
                if (updateTransactionDto.TransactionDate.HasValue)
                {
                    transaction.TransactionDate = updateTransactionDto.TransactionDate.Value;
                }

                await _context.SaveChangesAsync();

                // Aplicar el nuevo stock
                bool isIncrease = updateTransactionDto.TransactionType.ToLower() == "purchase";
                await _productService.UpdateStockAsync(transaction.ProductId, updateTransactionDto.Quantity, isIncrease);

                // Crear el DTO de respuesta
                var productResponse = await _productService.GetProductByIdAsync(transaction.ProductId);
                var dto = _mapper.Map<TransactionDto>(transaction);
                
                if (productResponse.Success && productResponse.Data != null)
                {
                    dto.ProductName = productResponse.Data.Name;
                    dto.ProductCategory = productResponse.Data.Category;
                    dto.CurrentStock = productResponse.Data.Stock;
                }

                return new ApiResponse<TransactionDto>
                {
                    Success = true,
                    Message = "Transaction updated successfully",
                    Data = dto
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating transaction with id {TransactionId}", id);
                return new ApiResponse<TransactionDto>
                {
                    Success = false,
                    Message = "Error updating transaction",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse<bool>> DeleteTransactionAsync(Guid id)
        {
            try
            {
                var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id);
                
                if (transaction == null)
                {
                    return new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Transaction not found"
                    };
                }

                // Revertir el efecto en el stock
                bool wasIncrease = transaction.TransactionType.ToLower() == "purchase";
                await _productService.UpdateStockAsync(transaction.ProductId, transaction.Quantity, !wasIncrease);

                // Eliminar la transacción
                _context.Transactions.Remove(transaction);
                await _context.SaveChangesAsync();

                return new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Transaction deleted successfully",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting transaction with id {TransactionId}", id);
                return new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Error deleting transaction",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse<List<TransactionDto>>> GetProductHistoryAsync(Guid productId)
        {
            try
            {
                var transactions = await _context.Transactions
                    .Where(t => t.ProductId == productId)
                    .OrderByDescending(t => t.TransactionDate)
                    .ToListAsync();

                var transactionDtos = new List<TransactionDto>();
                
                // Obtener información del producto
                var productResponse = await _productService.GetProductByIdAsync(productId);
                string productName = "Unknown Product";
                string productCategory = "Unknown";
                int currentStock = 0;
                
                if (productResponse.Success && productResponse.Data != null)
                {
                    productName = productResponse.Data.Name;
                    productCategory = productResponse.Data.Category;
                    currentStock = productResponse.Data.Stock;
                }
                
                foreach (var transaction in transactions)
                {
                    var dto = _mapper.Map<TransactionDto>(transaction);
                    dto.ProductName = productName;
                    dto.ProductCategory = productCategory;
                    dto.CurrentStock = currentStock;
                    
                    transactionDtos.Add(dto);
                }

                return new ApiResponse<List<TransactionDto>>
                {
                    Success = true,
                    Message = "Product history retrieved successfully",
                    Data = transactionDtos
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product history for product {ProductId}", productId);
                return new ApiResponse<List<TransactionDto>>
                {
                    Success = false,
                    Message = "Error retrieving product history",
                    Errors = new List<string> { ex.Message }
                };
            }
        }
    }
}

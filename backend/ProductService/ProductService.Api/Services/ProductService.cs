using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProductService.Api.Data;
using ProductService.Api.DTOs;
using ProductService.Api.Models;

namespace ProductService.Api.Services
{
    public class ProductService : IProductService
    {
        private readonly ProductDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<ProductService> _logger;

        public ProductService(ProductDbContext context, IMapper mapper, ILogger<ProductService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ApiResponse<PagedResult<ProductDto>>> GetProductsAsync(ProductFilterDto filter)
        {
            try
            {
                var query = _context.Products.AsQueryable();

                // Aplicar filtros
                if (!string.IsNullOrEmpty(filter.Name))
                {
                    query = query.Where(p => p.Name.ToLower().Contains(filter.Name.ToLower()));
                }

                if (!string.IsNullOrEmpty(filter.Category))
                {
                    query = query.Where(p => p.Category.ToLower().Contains(filter.Category.ToLower()));
                }

                if (filter.MinPrice.HasValue)
                {
                    query = query.Where(p => p.Price >= filter.MinPrice.Value);
                }

                if (filter.MaxPrice.HasValue)
                {
                    query = query.Where(p => p.Price <= filter.MaxPrice.Value);
                }

                if (filter.IsActive.HasValue)
                {
                    query = query.Where(p => p.IsActive == filter.IsActive.Value);
                }

                // Aplicar ordenamiento
                query = filter.SortBy.ToLower() switch
                {
                    "name" => filter.SortDescending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
                    "price" => filter.SortDescending ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
                    "stock" => filter.SortDescending ? query.OrderByDescending(p => p.Stock) : query.OrderBy(p => p.Stock),
                    "category" => filter.SortDescending ? query.OrderByDescending(p => p.Category) : query.OrderBy(p => p.Category),
                    _ => query.OrderBy(p => p.Name)
                };

                // Obtener total de elementos
                var totalItems = await query.CountAsync();

                // Aplicar paginación
                var items = await query
                    .Skip((filter.Page - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .ToListAsync();

                var productDtos = _mapper.Map<List<ProductDto>>(items);
                
                // Agregar estado del stock
                foreach (var dto in productDtos)
                {
                    dto.StockStatus = dto.Stock == 0 ? "Out of Stock" : 
                                     dto.Stock < 5 ? "Low Stock" : "In Stock";
                }

                var pagedResult = new PagedResult<ProductDto>
                {
                    Items = productDtos,
                    TotalItems = totalItems,
                    CurrentPage = filter.Page,
                    PageSize = filter.PageSize,
                    TotalPages = (int)Math.Ceiling(totalItems / (double)filter.PageSize),
                    HasNextPage = filter.Page < Math.Ceiling(totalItems / (double)filter.PageSize),
                    HasPreviousPage = filter.Page > 1
                };

                return new ApiResponse<PagedResult<ProductDto>>
                {
                    Success = true,
                    Message = "Products retrieved successfully",
                    Data = pagedResult
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving products");
                return new ApiResponse<PagedResult<ProductDto>>
                {
                    Success = false,
                    Message = "Error retrieving products",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse<ProductDto>> GetProductByIdAsync(Guid id)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
                
                if (product == null)
                {
                    return new ApiResponse<ProductDto>
                    {
                        Success = false,
                        Message = "Product not found"
                    };
                }

                var productDto = _mapper.Map<ProductDto>(product);
                productDto.StockStatus = product.Stock == 0 ? "Out of Stock" : 
                                        product.Stock < 5 ? "Low Stock" : "In Stock";

                return new ApiResponse<ProductDto>
                {
                    Success = true,
                    Message = "Product retrieved successfully",
                    Data = productDto
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product with id {ProductId}", id);
                return new ApiResponse<ProductDto>
                {
                    Success = false,
                    Message = "Error retrieving product",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse<ProductDto>> CreateProductAsync(CreateProductDto createProductDto)
        {
            try
            {
                var product = _mapper.Map<Product>(createProductDto);
                product.Id = Guid.NewGuid();
                product.CreatedAt = DateTime.UtcNow;
                product.UpdatedAt = DateTime.UtcNow;

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                var productDto = _mapper.Map<ProductDto>(product);
                productDto.StockStatus = product.Stock == 0 ? "Out of Stock" : 
                                        product.Stock < 5 ? "Low Stock" : "In Stock";

                return new ApiResponse<ProductDto>
                {
                    Success = true,
                    Message = "Product created successfully",
                    Data = productDto
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return new ApiResponse<ProductDto>
                {
                    Success = false,
                    Message = "Error creating product",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse<ProductDto>> UpdateProductAsync(Guid id, UpdateProductDto updateProductDto)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
                
                if (product == null)
                {
                    return new ApiResponse<ProductDto>
                    {
                        Success = false,
                        Message = "Product not found"
                    };
                }

                _mapper.Map(updateProductDto, product);
                product.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var productDto = _mapper.Map<ProductDto>(product);
                productDto.StockStatus = product.Stock == 0 ? "Out of Stock" : 
                                        product.Stock < 5 ? "Low Stock" : "In Stock";

                return new ApiResponse<ProductDto>
                {
                    Success = true,
                    Message = "Product updated successfully",
                    Data = productDto
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product with id {ProductId}", id);
                return new ApiResponse<ProductDto>
                {
                    Success = false,
                    Message = "Error updating product",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse<bool>> DeleteProductAsync(Guid id)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
                
                if (product == null)
                {
                    return new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Product not found"
                    };
                }

                // Soft delete
                product.IsActive = false;
                product.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Product deleted successfully",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product with id {ProductId}", id);
                return new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Error deleting product",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse<bool>> UpdateStockAsync(Guid productId, int quantity, bool isIncrease)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
                
                if (product == null)
                {
                    return new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Product not found"
                    };
                }

                if (isIncrease)
                {
                    product.Stock += quantity;
                }
                else
                {
                    if (product.Stock < quantity)
                    {
                        return new ApiResponse<bool>
                        {
                            Success = false,
                            Message = $"Insufficient stock. Available: {product.Stock}, Required: {quantity}"
                        };
                    }
                    product.Stock -= quantity;
                }

                product.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Stock updated successfully",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating stock for product {ProductId}", productId);
                return new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Error updating stock",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponse<bool>> CheckStockAvailabilityAsync(Guid productId, int requiredQuantity)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
                
                if (product == null)
                {
                    return new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Product not found"
                    };
                }

                var isAvailable = product.Stock >= requiredQuantity;
                var message = isAvailable ? "Stock is available" : $"Insufficient stock. Available: {product.Stock}, Required: {requiredQuantity}";

                return new ApiResponse<bool>
                {
                    Success = isAvailable,
                    Message = message,
                    Data = isAvailable
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking stock availability for product {ProductId}", productId);
                return new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Error checking stock availability",
                    Errors = new List<string> { ex.Message }
                };
            }
        }
    }
}
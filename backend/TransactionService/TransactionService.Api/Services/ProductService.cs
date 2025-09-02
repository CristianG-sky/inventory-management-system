using System.Text;
using System.Text.Json;
using TransactionService.Api.DTOs;

namespace TransactionService.Api.Services
{
    public class ProductService : IProductService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ProductService> _logger;
        private readonly string _productServiceBaseUrl;

        public ProductService(HttpClient httpClient, ILogger<ProductService> logger, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;
            _productServiceBaseUrl = configuration.GetValue<string>("Services:ProductService:BaseUrl") ?? 
                                   "https://localhost:7001";
        }

        public async Task<ProductApiResponse> GetProductByIdAsync(Guid productId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_productServiceBaseUrl}/api/products/{productId}");
                
                if (response.IsSuccessStatusCode)
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    var apiResponse = JsonSerializer.Deserialize<ProductApiResponse>(jsonContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    
                    return apiResponse ?? new ProductApiResponse { Success = false, Message = "Failed to deserialize response" };
                }
                
                return new ProductApiResponse 
                { 
                    Success = false, 
                    Message = $"Product service returned {response.StatusCode}" 
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling ProductService for product {ProductId}", productId);
                return new ProductApiResponse 
                { 
                    Success = false, 
                    Message = "Error communicating with ProductService" 
                };
            }
        }

        public async Task<ApiResponse<bool>> UpdateStockAsync(Guid productId, int quantity, bool isIncrease)
        {
            try
            {
                var request = new StockUpdateRequest 
                { 
                    Quantity = quantity, 
                    IsIncrease = isIncrease 
                };
                
                var json = JsonSerializer.Serialize(request);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync($"{_productServiceBaseUrl}/api/products/{productId}/stock", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    var apiResponse = JsonSerializer.Deserialize<ApiResponse<bool>>(jsonContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    
                    return apiResponse ?? new ApiResponse<bool> { Success = false, Message = "Failed to deserialize response" };
                }
                
                return new ApiResponse<bool> 
                { 
                    Success = false, 
                    Message = $"Product service returned {response.StatusCode}" 
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating stock for product {ProductId}", productId);
                return new ApiResponse<bool> 
                { 
                    Success = false, 
                    Message = "Error communicating with ProductService" 
                };
            }
        }

        public async Task<ApiResponse<bool>> CheckStockAvailabilityAsync(Guid productId, int requiredQuantity)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_productServiceBaseUrl}/api/products/{productId}/stock-check?requiredQuantity={requiredQuantity}");
                
                if (response.IsSuccessStatusCode)
                {
                    var jsonContent = await response.Content.ReadAsStringAsync();
                    var apiResponse = JsonSerializer.Deserialize<ApiResponse<bool>>(jsonContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    
                    return apiResponse ?? new ApiResponse<bool> { Success = false, Message = "Failed to deserialize response" };
                }
                
                return new ApiResponse<bool> 
                { 
                    Success = false, 
                    Message = $"Product service returned {response.StatusCode}" 
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking stock availability for product {ProductId}", productId);
                return new ApiResponse<bool> 
                { 
                    Success = false, 
                    Message = "Error communicating with ProductService" 
                };
            }
        }
    }
}

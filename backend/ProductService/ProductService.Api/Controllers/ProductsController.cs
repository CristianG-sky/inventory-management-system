using Microsoft.AspNetCore.Mvc;
using ProductService.Api.DTOs;
using ProductService.Api.Services;

namespace ProductService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IProductService productService, ILogger<ProductsController> logger)
        {
            _productService = productService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResult<ProductDto>>>> GetProducts([FromQuery] ProductFilterDto filter)
        {
            var result = await _productService.GetProductsAsync(filter);
            
            if (result.Success)
                return Ok(result);
                
            return BadRequest(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> GetProduct(Guid id)
        {
            var result = await _productService.GetProductByIdAsync(id);
            
            if (result.Success)
                return Ok(result);
                
            if (result.Message == "Product not found")
                return NotFound(result);
                
            return BadRequest(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ProductDto>>> CreateProduct([FromBody] CreateProductDto createProductDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<ProductDto>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                });
            }

            var result = await _productService.CreateProductAsync(createProductDto);
            
            if (result.Success)
                return CreatedAtAction(nameof(GetProduct), new { id = result.Data!.Id }, result);
                
            return BadRequest(result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> UpdateProduct(Guid id, [FromBody] UpdateProductDto updateProductDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<ProductDto>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                });
            }

            var result = await _productService.UpdateProductAsync(id, updateProductDto);
            
            if (result.Success)
                return Ok(result);
                
            if (result.Message == "Product not found")
                return NotFound(result);
                
            return BadRequest(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteProduct(Guid id)
        {
            var result = await _productService.DeleteProductAsync(id);
            
            if (result.Success)
                return Ok(result);
                
            if (result.Message == "Product not found")
                return NotFound(result);
                
            return BadRequest(result);
        }

        [HttpPost("{id}/stock")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateStock(Guid id, [FromBody] UpdateStockDto updateStockDto)
        {
            var result = await _productService.UpdateStockAsync(id, updateStockDto.Quantity, updateStockDto.IsIncrease);
            
            if (result.Success)
                return Ok(result);
                
            return BadRequest(result);
        }

        [HttpGet("{id}/stock-check")]
        public async Task<ActionResult<ApiResponse<bool>>> CheckStockAvailability(Guid id, [FromQuery] int requiredQuantity)
        {
            var result = await _productService.CheckStockAvailabilityAsync(id, requiredQuantity);
            
            if (result.Success)
                return Ok(result);
                
            return BadRequest(result);
        }
    }

    public class UpdateStockDto
    {
        public int Quantity { get; set; }
        public bool IsIncrease { get; set; }
    }
}

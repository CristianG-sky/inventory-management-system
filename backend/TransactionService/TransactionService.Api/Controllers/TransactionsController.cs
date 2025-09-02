using Microsoft.AspNetCore.Mvc;
using TransactionService.Api.DTOs;
using TransactionService.Api.Services;

namespace TransactionService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly ILogger<TransactionsController> _logger;

        public TransactionsController(ITransactionService transactionService, ILogger<TransactionsController> logger)
        {
            _transactionService = transactionService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedResult<TransactionDto>>>> GetTransactions([FromQuery] TransactionFilterDto filter)
        {
            var result = await _transactionService.GetTransactionsAsync(filter);
            
            if (result.Success)
                return Ok(result);
                
            return BadRequest(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<TransactionDto>>> GetTransaction(Guid id)
        {
            var result = await _transactionService.GetTransactionByIdAsync(id);
            
            if (result.Success)
                return Ok(result);
                
            if (result.Message == "Transaction not found")
                return NotFound(result);
                
            return BadRequest(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<TransactionDto>>> CreateTransaction([FromBody] CreateTransactionDto createTransactionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<TransactionDto>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                });
            }

            var result = await _transactionService.CreateTransactionAsync(createTransactionDto);
            
            if (result.Success)
                return CreatedAtAction(nameof(GetTransaction), new { id = result.Data!.Id }, result);
                
            return BadRequest(result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<TransactionDto>>> UpdateTransaction(Guid id, [FromBody] UpdateTransactionDto updateTransactionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<TransactionDto>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                });
            }

            var result = await _transactionService.UpdateTransactionAsync(id, updateTransactionDto);
            
            if (result.Success)
                return Ok(result);
                
            if (result.Message == "Transaction not found")
                return NotFound(result);
                
            return BadRequest(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteTransaction(Guid id)
        {
            var result = await _transactionService.DeleteTransactionAsync(id);
            
            if (result.Success)
                return Ok(result);
                
            if (result.Message == "Transaction not found")
                return NotFound(result);
                
            return BadRequest(result);
        }

        [HttpGet("product/{productId}/history")]
        public async Task<ActionResult<ApiResponse<List<TransactionDto>>>> GetProductHistory(Guid productId)
        {
            var result = await _transactionService.GetProductHistoryAsync(productId);
            
            if (result.Success)
                return Ok(result);
                
            return BadRequest(result);
        }
    }
}

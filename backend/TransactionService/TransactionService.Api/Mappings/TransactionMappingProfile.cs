using AutoMapper;
using TransactionService.Api.DTOs;
using TransactionService.Api.Models;

namespace TransactionService.Api.Mappings
{
    public class TransactionMappingProfile : Profile
    {
        public TransactionMappingProfile()
        {
            CreateMap<Transaction, TransactionDto>()
                .ForMember(dest => dest.ProductName, opt => opt.Ignore())
                .ForMember(dest => dest.ProductCategory, opt => opt.Ignore())
                .ForMember(dest => dest.CurrentStock, opt => opt.Ignore());

            CreateMap<CreateTransactionDto, Transaction>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.TransactionDate, opt => opt.Ignore())
                .ForMember(dest => dest.TotalPrice, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

            CreateMap<UpdateTransactionDto, Transaction>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.ProductId, opt => opt.Ignore())
                .ForMember(dest => dest.TotalPrice, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.TransactionDate, opt => opt.MapFrom(src => src.TransactionDate ?? DateTime.UtcNow));
        }
    }
}

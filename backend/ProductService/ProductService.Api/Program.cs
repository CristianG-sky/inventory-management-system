using Microsoft.EntityFrameworkCore;
using ProductService.Api.Data;
using ProductService.Api.Mappings;
using ProductService.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
    "Host=localhost;Database=InventoryManagement;Username=postgres;Password=password123";

builder.Services.AddDbContext<ProductDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(ProductMappingProfile));

// Register Services
builder.Services.AddScoped<IProductService, ProductService.Api.Services.ProductService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Configure Logging
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ProductDbContext>();
    try
    {
        context.Database.EnsureCreated();
        Console.WriteLine("Database connection successful!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database connection failed: {ex.Message}");
    }
}

Console.WriteLine("ProductService API is running on:");
Console.WriteLine("- HTTP: http://localhost:5001");
Console.WriteLine("- HTTPS: https://localhost:7001");
Console.WriteLine("- Swagger: https://localhost:7001/swagger");

app.Run();

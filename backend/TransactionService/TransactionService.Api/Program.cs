using Microsoft.EntityFrameworkCore;
using TransactionService.Api.Data;
using TransactionService.Api.Mappings;
using TransactionService.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar la base de datos
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
    "Host=localhost;Database=InventoryManagement;Username=postgres;Password=password123";

builder.Services.AddDbContext<TransactionDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configurar AutoMapper
builder.Services.AddAutoMapper(typeof(TransactionMappingProfile));

// Configurar HttpClient para ProductService
builder.Services.AddHttpClient<IProductService, ProductService>();

// Registrar servicios
builder.Services.AddScoped<ITransactionService, TransactionService.Api.Services.TransactionService>();

// Configurar CORS
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

// Configurar el sistema de logging
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
});

var app = builder.Build();

// Configurar el pipeline de solicitudes HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Usar CORS
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

// Asegurar que la base de datos se cree
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TransactionDbContext>();
    try
    {
        context.Database.EnsureCreated();
        Console.WriteLine("¡Conexión a la base de datos exitosa!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Fallo en la conexión a la base de datos: {ex.Message}");
    }
}

Console.WriteLine("La API TransactionService se está ejecutando en:");
Console.WriteLine("- HTTP: http://localhost:5002");
Console.WriteLine("- HTTPS: https://localhost:7002");
Console.WriteLine("- Swagger: https://localhost:7002/swagger");

app.Run();

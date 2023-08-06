using Core.Interfaces;
using Core.Interfaces.Repository;
using Infrastructure.Data;
using Infrastructure.Data.Repository;
using Infrastructure.Data.SeedData;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Net;
using System.Text;
using ToDoAPI.Helpers;
using ToDoAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DataContext>(options => options.UseSqlServer(connectionString));

var connectionStringIdentity = builder.Configuration.GetConnectionString("IdentityConnection");
builder.Services.AddDbContext<DataContext>(options => options.UseSqlServer(connectionStringIdentity));

builder.Services.AddCors();

builder.Services.AddTransient<IAuthRepository, AuthRepository>();
builder.Services.AddTransient<ITaskRepository, TaskRepository>();
builder.Services.AddTransient<IProjectRepository, ProjectRepository>();
builder.Services.AddTransient<ICommentRepository, CommentsRepository>();
builder.Services.AddTransient<ITokenService, TokenService>();
// builder.Services.AddTransient<IUpcomingTasksRepository, UpcomingTasksRepository>();
builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddAutoMapper(typeof(MappingProfiles));

// Alternative for keeping secret tokens rather than appSettings
// https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-6.0&tabs=windows
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(
                builder.Configuration.GetSection("AppSettings:Token").Value)),
            ValidateIssuer = false
        };
    });

builder.Services.AddControllers();
builder.Services.AddMvc(options =>
{
    //var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    //options.Filters.Add(new AuthorizeFilter(policy));

})
     .AddNewtonsoftJson(
          options =>
          {
              options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
          });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var loggerFactory = services.GetRequiredService<ILoggerFactory>();
    try
    {
        var context = services.GetRequiredService<DataContext>();
        await context.Database.MigrateAsync();
        await DataContextSeed.SeedAsync(context, loggerFactory);
    }
    catch (Exception ex)
    {
        var logger = loggerFactory.CreateLogger<Program>();
        logger.LogError(ex, "An error occured during migration");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(builder =>
{
    builder.Run(async context =>
    {
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var error = context.Features.Get<IExceptionHandlerFeature>();
        if (error != null)
        {
            context.Response.AddApplicationError(error.Error.Message);

            await context.Response.WriteAsync(error.Error.Message);
        }
    });
});

app.UseCors(x => x.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

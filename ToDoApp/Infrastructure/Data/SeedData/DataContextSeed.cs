using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data.SeedData
{
    public class DataContextSeed
    {
        public static async Task SeedAsync(DataContext context, ILoggerFactory loggerFactory)
        {
            try {
                if (!context.Projects.Any()) {
                    var projectsData = File.ReadAllText("../Infrastructure/Data/SeedData/json-seed-data/projects.json");
                    var projects = JsonSerializer.Deserialize<List<Core.Entities.Project>>(projectsData);

                    foreach(var item in projects){
                         context.Projects.Add(item);
                    }
                       await context.SaveChangesAsync();
                }

                if (!context.Tasks.Any()) {
                    var tasksData = File.ReadAllText("../Infrastructure/Data/SeedData/json-seed-data/tasks-data.json");
                    var tasks = JsonSerializer.Deserialize<List<Core.Entities.Task>>(tasksData);

                    foreach(var item in tasks){
                         context.Tasks.Add(item);
                    }
                    await context.SaveChangesAsync();
                }

                if (!context.Comments.Any()) {
                    var commentsData = File.ReadAllText("../Infrastructure/Data/SeedData/json-seed-data/comments.json");
                    var comments = JsonSerializer.Deserialize<List<Core.Entities.Comment>>(commentsData);

                    foreach(var item in comments){
                         context.Comments.Add(item);
                    }
                       await context.SaveChangesAsync();
                }
                
             
            }

            catch(Exception ex) {
                var logger = loggerFactory.CreateLogger<DataContextSeed>();
                logger.LogError(ex.Message);
            }
        }
    }
}
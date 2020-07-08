using Microsoft.EntityFrameworkCore;
using MovieJam.API.Models;

namespace MovieJam.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Movie> Movies { get; set; }
    }
}
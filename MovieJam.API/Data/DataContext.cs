using Microsoft.EntityFrameworkCore;
using MovieJam.API.Models;

namespace MovieJam.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<GenresOfMovie> GenresOfMovies { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Cart> Cart { get; set; }
        public DbSet<CartCollection> CartCollection { get; set; }
    }
}
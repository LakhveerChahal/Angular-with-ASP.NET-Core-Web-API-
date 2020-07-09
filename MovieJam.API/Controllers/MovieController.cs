using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieJam.API.Data;

namespace MovieJam.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MovieController: ControllerBase
    {
        private readonly DataContext _context;
        public MovieController(DataContext context)
        {
            _context = context;   
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMovies()
        {
            var movies = await _context.Movies.ToListAsync();
            // var genresOfMovies = await _context.GenresOfMovies.ToListAsync();
            // var genres = await _context.Genres.ToListAsync();

            return Ok(movies);
        } 

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovie(int id)
        {
            var movie = await _context.Movies.SingleOrDefaultAsync(m => m.Id == id);

            if(movie == null)
            return NotFound();
            
            return Ok(movie);
        }
    }
}
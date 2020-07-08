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

            return Ok(movies);
        } 
    }
}
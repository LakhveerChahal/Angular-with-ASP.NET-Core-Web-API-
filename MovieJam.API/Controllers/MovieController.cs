using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieJam.API.Data;
using MovieJam.API.Dtos;
using MovieJam.API.Models;

namespace MovieJam.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMovieRepository _movieRepo;

        public MovieController(DataContext context, IMovieRepository movieRepo)
        {
            _context = context;
            _movieRepo = movieRepo;
        }

        [HttpGet("movies")]
        public async Task<IActionResult> GetAllMovies()
        {
            return Ok(await _movieRepo.GetMoviesAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovie(int id)
        {
            var movie = await _movieRepo.GetMovieByIdAsync(id);

            if(movie == null)
            {
                return NotFound("No such movie exists in our database.");
            }

            return Ok(movie);
        }
    }
}
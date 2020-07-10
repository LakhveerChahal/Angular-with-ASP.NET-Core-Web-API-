using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieJam.API.Dtos;
using System.Linq;
using MovieJam.API.Models;

namespace MovieJam.API.Data
{
    public class MovieRepository : IMovieRepository
    {
        private readonly DataContext _context;

        public MovieRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<MovieDto> GetMovieByIdAsync(int id)
        {
            var movie = await _context.Movies.SingleOrDefaultAsync(m => m.Id == id);

            if(movie == null)
            {
                return null;
            }
            
            var genres = await (from g in _context.Genres
                            join mg in _context.GenresOfMovies.Where(g => g.MovieId == movie.Id)
                            on g.Id equals mg.GenreId
                            select g).ToListAsync();

            MovieDto movieDto = new MovieDto();
            movieDto.MovieId = movie.Id;
            movieDto.MovieName = movie.MovieName;
            movieDto.MoviePrice = movie.MoviePrice;
            movieDto.Genres = genres;
                    
            return movieDto;
        }

        public async Task<List<MovieDto>> GetMoviesAsync()
        {
            var movies = await _context.Movies.ToListAsync();
            var movieGenres = await _context.GenresOfMovies.ToListAsync();
            var genres = await _context.Genres.ToListAsync();

            List<MovieDto> moviesDtos = new List<MovieDto>();
            foreach (var movie in movies)
            {
                MovieDto movieDto = new MovieDto();
                movieDto.MovieId = movie.Id;
                movieDto.MovieName = movie.MovieName;
                movieDto.MoviePrice = movie.MoviePrice;
                movieDto.Genres = genres.FindAll(g => 
                    movieGenres.Exists(mg => mg.MovieId == movie.Id && mg.GenreId == g.Id));
                
                moviesDtos.Add(movieDto);
            }

            return moviesDtos;
        }
    }
}
using System.Collections.Generic;
using System.Threading.Tasks;
using MovieJam.API.Dtos;

namespace MovieJam.API.Data
{
    public interface IMovieRepository
    {
         Task<List<MovieDto>> GetMoviesAsync();
         Task<MovieDto> GetMovieByIdAsync(int id);
    }
}
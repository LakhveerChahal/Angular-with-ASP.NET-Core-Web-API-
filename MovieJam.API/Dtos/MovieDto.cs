using MovieJam.API.Models;

namespace MovieJam.API.Dtos
{
    public class MovieDto
    {
        public int id { get; set; }
        public string MovieName { get; set; }
        public float MoviePrice { get; set; }
        public Genre[] Genres { get; set; }
    }
}
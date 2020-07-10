using System.Collections.Generic;
using MovieJam.API.Models;

namespace MovieJam.API.Dtos
{
    public class MovieDto
    {
        public int MovieId { get; set; }
        public string MovieName { get; set; }
        public float MoviePrice { get; set; }
        public List<Genre> Genres { get; set; }
    }
}
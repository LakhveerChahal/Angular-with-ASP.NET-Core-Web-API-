import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Movie } from '../Models/movie.model';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {
  filteredMovies: Movie[];

  constructor(private route: ActivatedRoute, private movieService: MovieService) { }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      const searchString = param.searchString;
      this.movieService.getMovies().subscribe((data: Movie[]) => {
        const allMovies = data;
        this.filteredMovies = allMovies.filter(m => {
          return m.movieName.toLowerCase().includes(searchString.toLowerCase());
        });
        console.log(this.filteredMovies);
      });
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MovieService } from '../services/movie.service';
import { Movie } from '../Models/movie.model';
import { Genre } from '../Models/genre.model';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movieFound: Movie;

  constructor(private movieService: MovieService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getId();
    // this.movieService.movieSubject.subscribe(movie => {
    //   this.movieFound = movie;
    // });
  }

  getMovieById(movieId: string){
    this.movieService.getMovieById(movieId).subscribe(movie => {
      this.movieFound = movie;
      console.log(this.movieFound);
    });
  }

  getId(){
    this.route.params.subscribe((params) => {
      this.getMovieById(params['id']);
    });
  }

}

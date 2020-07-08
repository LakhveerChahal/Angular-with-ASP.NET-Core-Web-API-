import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Movie } from '../Models/movie.model';
import { Genre } from '../Models/genre.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  movies: Movie[];
  movieSubject = new Subject<Movie>();
  moviesUrl = 'https://movieplace-97b9e.firebaseio.com/Movies.json';

  constructor(private http: HttpClient) { }

  getMovies() {
    return this.http.get<Movie []>(this.moviesUrl);
  }

  getMovieById(movieId: string){
    this.getMovies().subscribe(m => {
      const movies: Movie[] = m;
      let movieFound: Movie;
      movieFound = movies.find(m => m.movieId === movieId);
      if (movieFound) {
        this.movieSubject.next(movieFound);
      }else{
        this.movieSubject.next(null);
      }
    });
  }

  getGenres() {
    return this.http.get<Genre[]>(this.moviesUrl);
  }
}

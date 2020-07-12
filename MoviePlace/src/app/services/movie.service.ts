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
  // moviesUrl = 'https://movieplace-97b9e.firebaseio.com/Movies.json';
  baseUrl = "http://localhost:5000/";

  constructor(private http: HttpClient) { }

  getMovies() {
    return this.http.get<Movie []>(this.baseUrl + 'movie/movies');
  }

  getMovieById(movieId: string){
    return this.http.get<Movie>(this.baseUrl + 'movie/' + movieId);
  }

}

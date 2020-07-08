import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CartItem } from '../Models/cart-item.model';
import { MovieService } from './movie.service';
import { Movie } from '../Models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class CartService{
  cart: CartItem[] = [];
  updateEvent = new Subject<void>();
  movieById: Movie;

  constructor(private movieService: MovieService) { }

  addToCart(movieId: string){
    this.movieService.getMovieById(movieId);
    const movieSub = this.movieService.movieSubject.subscribe(movie => {
      this.movieById = movie;
      this.addMovieToCart();
      movieSub.unsubscribe();
    });
  }

  private addMovieToCart(){
    if(this.movieById){
      let cartItem: CartItem = {
        movieId: this.movieById.movieId,
        price: this.movieById.moviePrice,
        timestamp: Date.parse(Date.now().toString())
      };
      if(!this.cart.some(c => c.movieId === this.movieById.movieId)){
        this.cart.push(cartItem);
        this.emitUpdateEvent();
      }
    }
    console.log(this.cart);
  }

  emitUpdateEvent(){
    this.updateEvent.next();
  }

  contains(movieId: string): boolean{
    return this.cart.some((m) => {
      return m.movieId === movieId;
    });
  }

  removeFromCart(movieId: string){
    const index = this.cart.findIndex(m => {
      return m.movieId === movieId;
    });
    if(index != -1){
      this.cart.splice(index, 1);
      this.emitUpdateEvent();
    }
  }

}

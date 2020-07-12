import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { CartItem } from '../Models/cart-item.model';
import { Movie } from '../Models/movie.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService{
  cart: CartItem[] = [];
  updateEvent = new Subject<void>();
  movieById: Movie;
  baseUrl = 'http://localhost:5000/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  addToCart(movieId: string){
    const userId = this.authService.getLoggedInUserId();
    const cartItem: CartItem = {
      userId: userId,
      movieId: movieId
    };
    return this.http.post(this.baseUrl + 'addToCart',
    {
      cartItem: cartItem
    });
  }

  emitUpdateEvent(){
    this.updateEvent.next();
  }

  checkCart(){
    const userId = this.authService.getLoggedInUserId();
    return this.http.post<boolean>(this.baseUrl + '/myorders',{
      userId: userId
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

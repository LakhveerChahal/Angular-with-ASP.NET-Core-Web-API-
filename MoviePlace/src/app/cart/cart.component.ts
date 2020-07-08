import { Component, OnInit, OnDestroy } from '@angular/core';

import { MovieService } from '../services/movie.service';
import { CartService } from '../services/cart.service';
import { Movie } from '../Models/movie.model';
import { CartItem } from '../Models/cart-item.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: CartItem[] = [];
  movies: Movie[] = [];
  movieOb: any;
  isLoading = false;

  constructor(private cartService: CartService, private movieService: MovieService) { }

  ngOnInit(): void {
    this.refreshCart();
  }

  onRemoveClick(movieId: string){
    this.cartService.removeFromCart(movieId); 
    this.refreshCart();
  }

  refreshCart(){
    this.isLoading =true;
    this.cart = this.cartService.cart;
    this.movieOb = this.movieService.getMovies().subscribe((data) => {
      this.movies = data.filter((m) => this.cart.some(c => c.movieId === m.movieId));
      this.isLoading = false;
    });
  }

  ngOnDestroy(){
    this.movieOb.unsubscribe();
  }

}

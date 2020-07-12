import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartCount = 0;
  isLoggedIn = false;
  updateEventSub: Subscription;
  userSub: Subscription;
  username: string = '';

  constructor(private cartService: CartService, private authService: AuthService) { }

  ngOnInit(): void {
    this.updateEventSub = this.cartService.updateEvent.subscribe(() => {
      this.cartCount = this.cartService.cart.length;
    });
    this.userSub = this.authService.user.subscribe(user => {
      this.isLoggedIn = !!user;
      if(user){
        this.username = user.username;
      }
    });
  }

  onLogout(){
    this.authService.logout();
  }

  LoggedIn(){
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnDestroy(){
    this.updateEventSub.unsubscribe();
    this.userSub.unsubscribe();
  }

}

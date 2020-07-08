import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponse } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../Models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  authObs: Observable<AuthResponse>;
  errorMsg: string;
  authUser: User;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user.subscribe(authData => {
      this.authUser = authData;
      console.log(this.authUser);
    });
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if(this.isLoginMode){
      this.authObs = this.authService.login(email, password);
    }
    else{
      this.authObs = this.authService.signUp(email, password);
    }
    this.authObs.subscribe(
      res => {

      },
      err => {
        this.errorMsg = err;
      }
    );
    form.reset();
  }

}

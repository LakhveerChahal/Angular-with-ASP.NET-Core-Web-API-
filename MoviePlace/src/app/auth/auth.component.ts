import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../Models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  authObs: Observable<Object>;
  errorMsg: string;
  authUser: User;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user.subscribe(authData => {
      this.authUser = authData;
    });
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const username = form.value.username;
    const password = form.value.password;

    if(this.isLoginMode){
      this.authObs = this.authService.login(username, password);
    }
    else{
      this.authObs = this.authService.signUp(username, password);
    }
    this.authObs.subscribe(
      res => {
        this.router.navigate(['/home']);
      },
      err => {
        this.errorMsg = err;
      }
    );
    form.reset();
  }

}

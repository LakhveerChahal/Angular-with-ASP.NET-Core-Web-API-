import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '../Models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  autoLogoutInterval: any;
  baseUrl = 'http://localhost:5000/';
  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http
      .post(this.baseUrl + 'auth/login', {
        username: username,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((res: { token: string }) => {
          this.handleAuthData(res.token);
        })
      );
  }

  signUp(username: string, password: string) {
    return this.http
      .post(this.baseUrl + 'auth/register', {
        username: username,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((res: { token: string }) => {
          this.handleAuthData(res.token);
        })
      );
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.autoLogoutInterval) {
      clearInterval(this.autoLogoutInterval);
    }
    this.autoLogoutInterval = null;
    this.router.navigate(['/login']);
  }

  private handleAuthData(token: string) {
    localStorage.setItem('userData', token);
    this.autoLogin();
  }

  autoLogin() {
    const token = localStorage.getItem('userData');
    if (!token) {
      return this.user.next(null);
    }
    const isExpired = this.jwtHelper.isTokenExpired(token);
    if (isExpired) {
      return this.user.next(null);
    }
    const user = new User(this.jwtHelper.decodeToken(token).unique_name);
    // console.log(this.jwtHelper.decodeToken(token));
    this.user.next(user);
  }

  autoLogout(expirationDuration: number) {
    this.autoLogoutInterval = setInterval(() => {
      this.logout();
    }, expirationDuration);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('userData');
    if (token) {
      return !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }

  getLoggedInUserId() {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem('userData');
      return this.jwtHelper.decodeToken(token).nameid;
    }
    return null;
  }

  private handleError(err: HttpErrorResponse) {
    if (err && err.error) {
      let errmsg;
      switch (err.error.error.message) {
        case 'username_EXISTS':
          errmsg = 'Oops! username already exists!';
          break;
        case 'username_NOT_FOUND':
          errmsg = 'Invalid username or password';
          break;
        case 'username_NOT_FOUND':
          errmsg = 'Invalid username or password';
          break;
        default:
          errmsg = 'An unknown error occured. Please try again later.';
      }
      return throwError(errmsg);
    } else {
      return throwError('An unknown error occured.');
    }
  }
}

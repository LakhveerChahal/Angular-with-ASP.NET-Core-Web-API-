import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from '../Models/user.model';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  autoLogoutInterval: any;

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC8ZMWtzxmH1xJj4xb7VULqZ0DGmAzG_j4',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthData(resData.email, resData.idToken, +resData.expiresIn, resData.localId);
        })
      );
  }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC8ZMWtzxmH1xJj4xb7VULqZ0DGmAzG_j4',
      {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthData(resData.email, resData.idToken, +resData.expiresIn, resData.localId);
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

  private handleAuthData(email: string, token: string, expiresIn: number, userId: string) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogin() {
    const userData:
      {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate
      } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const user = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    this.user.next(user);
  }

  autoLogout(expirationDuration: number) {
    this.autoLogoutInterval = setInterval(() => {
      this.logout();
    }, expirationDuration);
  }


  private handleError(err: HttpErrorResponse) {
    if (err && err.error) {
      let errmsg;
      switch (err.error.error.message) {
        case "EMAIL_EXISTS":
          errmsg = "Oops! Email already exists!";
          break;
        case "EMAIL_NOT_FOUND":
          errmsg = "Invalid username or password";
          break;
        case "EMAIL_NOT_FOUND":
          errmsg = "Invalid username or password";
          break;
        default:
          errmsg = "An unknown error occured. Please try again later.";
      }
      return throwError(errmsg);
    }
    else {
      return throwError("An unknown error occured.");
    }
  }
}

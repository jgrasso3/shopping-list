import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { User } from "./user.model";
import { Route, Router } from "@angular/router";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);

  private apiKey = 'AIzaSyCP9suY-rOKfEKjifl-XPAdA2UM3z0XC2A'
  private tokenExpireTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + this.apiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(
      // it's beeter to handle error logic in the service rather than the components
      catchError(this.handleError),
      // use tap to modify the response so we can create a new user subject
      tap(respData => {
        this.handleAuth(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
      })
    );
    }
  
  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + this.apiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
    .pipe(
      catchError(this.handleError),
      tap(respData => {
        this.handleAuth(respData.email, respData.localId, respData.idToken, +respData.expiresIn);
      })
    );
  }

  // access the previous user if there
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpireDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    // convert from a json string to a user model
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpireDate)
    );

    // check if token is present and valid
    if (loadedUser.token) {
      this.user.next(loadedUser);
      // have to calculate time remaining on token
      const expireLeft = 
        new Date(userData._tokenExpireDate).getTime() - 
        new Date().getTime();
      this.autoLogout(expireLeft);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);

    // ensure we disable the autologout timer if we manually logout
    if (this.tokenExpireTimer) {
      clearTimeout(this.tokenExpireTimer);
    }
    this.tokenExpireTimer = null;

    // clear user data on logout
    localStorage.removeItem('userData');
  }

  autoLogout(expiration: number) {
    this.tokenExpireTimer = setTimeout(() => {
      this.logout();
    }, expiration);
  }

  private handleError(errorResp: HttpErrorResponse) {
    let errorMes = 'An unknown error occured';

    // incase the error has a different format
    if (!errorResp.error || !errorResp.error.error) {
      return throwError(errorMes)
    }
    switch (errorResp.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMes = 'This email is taken';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMes = 'There is no account with this email';
        break;
      case 'INVALID_PASSWORD':
        errorMes = 'Incorrect Password';
        break;

    }
    return throwError(errorMes);
  }

  private handleAuth(email: string, userID: string, token: string, expiresIn: number) {
    const expiration = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userID, token, expiration);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);

    // store locally on machine managed by browser, store as a json string
    localStorage.setItem('userData', JSON.stringify(user));
  }
}

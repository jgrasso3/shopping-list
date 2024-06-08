import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { exhaustMap, take } from "rxjs/operators";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  
  constructor(private authServ: AuthService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authServ.user.pipe(
      // the take() opp will only get the value once and immediately unsuscribe
      take(1),
      // exhaustMap() waits for 1st obsv to complete (getUser once), take its data, and replace the prev obsv in the chain
      // with the obsv we return in it
      exhaustMap(user => {
        // only try to add auth token if we have a user, else logging in will fail
        if (!user) {
          return next.handle(req);
        }
        const modReq = req.clone({
          // Firebase specifically takes the auth token as a param
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modReq);
      })
    );
  }
}

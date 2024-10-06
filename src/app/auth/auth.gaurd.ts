import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { map, take } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private authServ: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): MaybeAsync<GuardResult> {
    // have to use a map opperator so we can return a boolean if we have a user
    return this.authServ.user.pipe(
      take(1), // make sure there is no ongoing user subscription
      map(user => {
        const isAuth = !!user; // trick to turn a value into a bool
        if (isAuth) {
          return true;
        } else {
          return this.router.createUrlTree(['/auth']); // if no authenticated user is found, redirect to auth page
        }
      })
    );
  }
}

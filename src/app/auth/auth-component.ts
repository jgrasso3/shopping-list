import { Component, ComponentFactoryResolver, ViewChild } from "@angular/core";
import { NgForm } from '@angular/forms';
import { Observable } from "rxjs";

import { AuthResponseData, AuthService } from "./auth.service";
import { Router } from "@angular/router";
// import { AlertComponent } from "../shared/alert/alert.component";
import { FooDirective } from "../shared/foo/foo.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth-component.html'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  // @ViewChild(FooDirective) alertHost: FooDirective;

  constructor(
    private authService: AuthService, 
    private router: Router,
    // private cmpFactRes: ComponentFactoryResolver
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    // safeguard
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    let authResp: Observable<AuthResponseData>

    this.isLoading = true;
    if (this.isLoginMode) {
      authResp = this.authService.login(email, password);
    } else {
      authResp = this.authService.signup(email, password);
    }

    authResp.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      // our service is configured to only throw a message
      errorMes => {
        this.error = errorMes;
        // this.showErrorAlert(errorMes);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onDismissError() {
    this.error = null;
  }

  // Comp Fac would need to be called whenever we have an error
  // this is very unfinished. comp fac is hella depricated and not worth learning
  // private showErrorAlert(message: string) {
  //   // can't simply create a new instance of the alert comp, must use Comp Factory Resolver
  //   const alertCmpFac = this.cmpFactRes.resolveComponentFactory(AlertComponent);
  //   const hostViewContRef = this.alertHost.viewConRef;
  //   hostViewContRef.clear();

  //   hostViewContRef.createComponent(alertCmpFac);
  // }
}

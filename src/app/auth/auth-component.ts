import { Component } from "@angular/core";
import { NgForm } from '@angular/forms';
import { Observable } from "rxjs";

import { AuthResponseData, AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth-component.html'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

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
      errrorMes => {
        this.error = errrorMes;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}

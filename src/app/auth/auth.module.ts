import { NgModule } from "@angular/core";

import { AuthComponent } from "./auth-component";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: AuthComponent }
    ])
  ],
  exports: []
})
export class AuthModule {

}

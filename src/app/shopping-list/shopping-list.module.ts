import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    ShoppingListComponent,
		ShoppingEditComponent
  ],
  imports: [
    FormsModule,
    // Since this module is so small and only 1 route, handle routes here
    RouterModule.forChild([
      { path: '', component: ShoppingListComponent }
    ]),
    // not worth importing shared here, but is a good example
    SharedModule,
  ],
  exports: []
})
export class ShoppingListModule {

}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { SharedModule } from './shared/shared.module';
// import { FooDirective } from './shared/foo/foo.directive';
// import { RecipesModule } from './recipes/recipes.module';
// import { ShoppingListModule } from './shopping-list/shopping-list.module';
// import { AuthModule } from './auth/auth.module';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		// FooDirective,
	],
	bootstrap: [AppComponent],
	// recipe, auth, and shopping dont need to be imported since we are lazy loading them
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		SharedModule,
		// RecipesModule,
		// ShoppingListModule,
		// AuthModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptorService,
			multi: true
		},
		provideHttpClient(withInterceptorsFromDi())
	]
})
export class AppModule { }

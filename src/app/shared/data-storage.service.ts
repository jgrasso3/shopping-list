import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  url = 'https://ng-complete-guide-43ee8-default-rtdb.firebaseio.com';
  constructor(
    private http: HttpClient, 
    private recipeService: RecipeService,
    private authServ: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(this.url + '/recipes.json', recipes)
      .subscribe(resp => {
        console.log(resp);
      });
  }

  getRecipes() {
    return this.http
      .get<Recipe[]>(this.url + '/recipes.json')
      .pipe(
        // top map is the rxjs opp, bottom is the JS map func
        map(recipes => {
          // create an empty ingredients[] if the recipe doesn't contain any ingredients
          return recipes.map(recipe => {
            return {
              // expand the whole recipe obj and add a new ing[] if needed
              ...recipe, 
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes)
        })
      );
  }
}

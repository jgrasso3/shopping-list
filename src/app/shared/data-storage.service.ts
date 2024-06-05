import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from 'rxjs/operators';

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  url = 'https://ng-complete-guide-43ee8-default-rtdb.firebaseio.com';
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

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
          return recipes.map(recipe => {
            return {
              ...recipe, 
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes)
        })
      )
  }
}

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot } from "@angular/router";

import { Recipe } from "./recipe.model";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "./recipe.service";

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(private dsService: DataStorageService, private recipeService: RecipeService) {}

  // This will fix a bug where data is not loaded on refresh while viewing a recipe
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipeService.getRecipes()
    
    // If data is already loaded, no need to resolve
    if (recipes.length === 0) {
      return this.dsService.getRecipes();
    } else {
      return recipes;
    }
  }
}

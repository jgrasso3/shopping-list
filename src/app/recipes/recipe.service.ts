import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingService } from "../shopping-list/shopping.service";

@Injectable({providedIn: 'root'})
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'dummy 1', 
      'this is a dummy recipe 1', 
      'https://lobsterfrommaine.com/wp-content/uploads/fly-images/1577/20210517-Pasta-alla-Gricia-with-Lobster3010-2048x576-c.jpg',
      [
        new Ingredient('beef', 1),
        new Ingredient('spaghetti', 1)
      ]),
    new Recipe(
      'dummy 2', 
      'this is a dummy recipe 2', 
      'https://lobsterfrommaine.com/wp-content/uploads/fly-images/1577/20210517-Pasta-alla-Gricia-with-Lobster3010-2048x576-c.jpg',
      [
        new Ingredient('salmon', 1),
        new Ingredient('rottini', 1)
      ]),
  ];
  recipeChanged = new Subject<Recipe[]>();

  constructor(private shoppingService: ShoppingService) {};

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addToList(ings: Ingredient[]) {
    this.shoppingService.addItems(ings);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
    return this.recipes.length - 1;
  }

  updateEcipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}

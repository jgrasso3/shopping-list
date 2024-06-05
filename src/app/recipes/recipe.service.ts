import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingService } from "../shopping-list/shopping.service";

@Injectable({providedIn: 'root'})
export class RecipeService {
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Bolognese', 
  //     "Classic, can't go wrong", 
  //     'https://lobsterfrommaine.com/wp-content/uploads/fly-images/1577/20210517-Pasta-alla-Gricia-with-Lobster3010-2048x576-c.jpg',
  //     [
  //       new Ingredient('beef', 1),
  //       new Ingredient('pasta', 3)
  //     ]),
  //   new Recipe(
  //     'Salmon Pasta', 
  //     "Something that's not chicken", 
  //     'https://www.saltandlavender.com/wp-content/uploads/2020/06/creamy-salmon-asparagus-pasta-1-300x300.jpg',
  //     [
  //       new Ingredient('salmon', 1),
  //       new Ingredient('pasta', 5)
  //     ]),
  // ];
  private recipes: Recipe[] = [];
  recipeChanged = new Subject<Recipe[]>();

  constructor(private shoppingService: ShoppingService) {};

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

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

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}
